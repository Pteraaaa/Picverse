export class SubmissionBuilder {
  private submission: any = {};

  setEmail(email: string): SubmissionBuilder {
    this.submission.email = email;
    return this;
  }

  setTitle(title: string): SubmissionBuilder {
    this.submission.title = title;
    return this;
  }

  setDescription(description: string): SubmissionBuilder {
    this.submission.description = description;
    return this;
  }

  setTags(tags: string): SubmissionBuilder {
    this.submission.tags = tags;
    return this;
  }

  setFileUrl(fileUrl: string): SubmissionBuilder {
    this.submission.fileUrl = fileUrl;
    return this;
  }

  setFileName(fileName: string): SubmissionBuilder {
    this.submission.fileName = fileName;
    return this;
  }

  setIsAiGenerated(isAiGenerated: boolean): SubmissionBuilder {
    this.submission.isAiGenerated = isAiGenerated;
    return this;
  }

  setUserId(userId: number): SubmissionBuilder {
    this.submission.userId = userId;
    return this;
  }

  setStatus(status: string): SubmissionBuilder {
    this.submission.status = status;
    return this;
  }

  build() {
    if (
      !this.submission.email ||
      !this.submission.title ||
      !this.submission.description ||
      !this.submission.tags ||
      !this.submission.fileUrl ||
      !this.submission.fileName ||
      this.submission.isAiGenerated === undefined
    ) {
      throw new Error('Missing required submission fields');
    }

    return this.submission;
  }
}
