from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class FolderIn(BaseModel):
    id: str
    name: str
    parentId: str = "root"
    path: list[str] = Field(default_factory=list)
    itemCount: int = 0


class FolderUpdate(BaseModel):
    name: str


class FileIn(BaseModel):
    id: str
    name: str
    extension: str
    size: str = "0 KB"
    author: str
    category: str
    folderId: str
    description: str | None = None
    isFavorite: bool = False
    isShared: bool = False
    isPublic: bool = False
    createdAt: datetime


class FileUpdate(BaseModel):
    isFavorite: bool | None = None
    isShared: bool | None = None
    isPublic: bool | None = None


class LibraryData(BaseModel):
    folders: list[FolderIn]
    files: list[FileIn]


class Stats(BaseModel):
    totalFiles: int
    totalFolders: int
    totalUsers: int = 0
    totalDownloads: int = 0
    storageUsed: float = 0
    storageLimit: float = 15
