import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

export default class FakeStorageProvider implements IStorageProvider {
  private storage: string[] = [];

  public async saveFile(file: string): Promise<string> {
    this.storage.push(file);
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const existingFile = this.storage.findIndex(
      storagedFile => storagedFile === file,
    );

    if (existingFile >= 0) {
      this.storage.splice(existingFile, 1);
    }
  }
}
