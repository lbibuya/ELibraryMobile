import json
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from .models import Folder, LibraryFile
from .schemas import FileIn, FileUpdate, FolderIn, FolderUpdate, LibraryData, Stats


def folder_out(folder: Folder) -> FolderIn:
    return FolderIn(id=folder.id, name=folder.name, parentId=folder.parent_id,
                    path=json.loads(folder.path), itemCount=folder.item_count)


def file_out(file: LibraryFile) -> FileIn:
    return FileIn(id=file.id, name=file.name, extension=file.extension, size=file.size,
                  author=file.author, category=file.category, folderId=file.folder_id,
                  description=file.description, isFavorite=file.is_favorite,
                  isShared=file.is_shared, isPublic=file.is_public, createdAt=file.created_at)


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="E-Library API", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/library", response_model=LibraryData)
def get_library(db: Session = Depends(get_db)):
    folders = db.scalars(select(Folder).order_by(Folder.name)).all()
    files = db.scalars(select(LibraryFile).order_by(LibraryFile.created_at.desc())).all()
    return LibraryData(folders=[folder_out(folder) for folder in folders], files=[file_out(file) for file in files])


@app.post("/api/folders", response_model=FolderIn, status_code=201)
def create_folder(payload: FolderIn, db: Session = Depends(get_db)):
    if db.get(Folder, payload.id):
        raise HTTPException(status_code=409, detail="Folder already exists")
    folder = Folder(id=payload.id, name=payload.name, parent_id=payload.parentId,
                    path=json.dumps(payload.path), item_count=payload.itemCount)
    db.add(folder)
    db.commit()
    return folder_out(folder)


@app.delete("/api/folders/{folder_id}", status_code=204)
def delete_folder(folder_id: str, db: Session = Depends(get_db)):
    folder = db.get(Folder, folder_id)
    if not folder:
        raise HTTPException(status_code=404, detail="Folder not found")
    # A folder is a tree: remove descendants and their files together, not just one level.
    folder_ids = {folder_id}
    pending = [folder_id]
    while pending:
        children = db.scalars(select(Folder.id).where(Folder.parent_id == pending.pop())).all()
        for child_id in children:
            if child_id not in folder_ids:
                folder_ids.add(child_id)
                pending.append(child_id)
    db.query(LibraryFile).filter(LibraryFile.folder_id.in_(folder_ids)).delete(synchronize_session=False)
    db.query(Folder).filter(Folder.id.in_(folder_ids)).delete(synchronize_session=False)
    db.commit()


@app.patch("/api/folders/{folder_id}", response_model=FolderIn)
def update_folder(folder_id: str, payload: FolderUpdate, db: Session = Depends(get_db)):
    folder = db.get(Folder, folder_id)
    if not folder:
        raise HTTPException(status_code=404, detail="Folder not found")
    folder.name = payload.name.strip()
    db.commit()
    return folder_out(folder)


@app.post("/api/files", response_model=FileIn, status_code=201)
def create_file(payload: FileIn, db: Session = Depends(get_db)):
    if db.get(LibraryFile, payload.id):
        raise HTTPException(status_code=409, detail="File already exists")
    file = LibraryFile(id=payload.id, name=payload.name, extension=payload.extension,
                       size=payload.size, author=payload.author, category=payload.category,
                       folder_id=payload.folderId, description=payload.description,
                       is_favorite=payload.isFavorite, is_shared=payload.isShared,
                       is_public=payload.isPublic, created_at=payload.createdAt)
    db.add(file)
    db.commit()
    return file_out(file)


@app.patch("/api/files/{file_id}", response_model=FileIn)
def update_file(file_id: str, payload: FileUpdate, db: Session = Depends(get_db)):
    file = db.get(LibraryFile, file_id)
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(file, {"isFavorite": "is_favorite", "isShared": "is_shared", "isPublic": "is_public"}[field], value)
    db.commit()
    return file_out(file)


@app.delete("/api/files/{file_id}", status_code=204)
def delete_file(file_id: str, db: Session = Depends(get_db)):
    file = db.get(LibraryFile, file_id)
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    db.delete(file)
    db.commit()


@app.get("/api/stats", response_model=Stats)
def get_stats(db: Session = Depends(get_db)):    # compter fichiers et dossiers    total_files = db.scalar(select(func.count()).select_from(LibraryFile)) or 0    total_folders = db.scalar(select(func.count()).select_from(Folder)) or 0    # calculer l'espace utilisé à partir du champ size (ex: "2.4 MB", "450 KB", "12.3 Mo", ...)    import re    sizes = db.scalars(select(LibraryFile.size)).all() or []    total_bytes = 0    for s in sizes:        if not s:            continue        m = re.search(r"([\d.,]+)\s*(o|b|ko|kb|mo|mb|go|gb)?", s, re.I)        if not m:            continue        try:            num = float(m.group(1).replace(',', '.'))        except Exception:            continue        unit = (m.group(2) or '').lower()        if unit in ('o', 'b'):            total_bytes += num        elif unit in ('ko', 'kb'):            total_bytes += num * 1024        elif unit in ('mo', 'mb'):            total_bytes += num * 1024 ** 2        elif unit in ('go', 'gb'):            total_bytes += num * 1024 ** 3        else:            total_bytes += num    storage_used_gb = round(total_bytes / (1024 ** 3), 1)    return Stats(totalFiles=total_files, totalFolders=total_folders, storageUsed=storage_used_gb, storageLimit=15)
