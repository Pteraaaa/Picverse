import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface UploadFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

interface FileUploadStrategy {
  upload(file: UploadFile): Promise<{ fileUrl: string; fileName: string }>;
}

@Injectable()
export class LocalFileUploadStrategy implements FileUploadStrategy {
  private uploadDir = path.join(process.cwd(), 'uploads', 'submissions');

  constructor() {
    this.ensureUploadDirExists();
  }

  private ensureUploadDirExists(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: UploadFile): Promise<{ fileUrl: string; fileName: string }> {
    const uniqueFileName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    const filePath = path.join(this.uploadDir, uniqueFileName);

    fs.writeFileSync(filePath, file.buffer);

    return {
      fileUrl: `/uploads/submissions/${uniqueFileName}`,
      fileName: file.originalname,
    };
  }
}

@Injectable()
export class FileUploadService {
  private strategy: FileUploadStrategy;

  constructor() {
    this.strategy = new LocalFileUploadStrategy();
  }

  setStrategy(strategy: FileUploadStrategy): void {
    this.strategy = strategy;
  }

  async uploadFile(file: UploadFile): Promise<{ fileUrl: string; fileName: string }> {
    return this.strategy.upload(file);
  }
}
