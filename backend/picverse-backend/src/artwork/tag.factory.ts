import { Injectable } from '@nestjs/common';

export interface TagPayload {
  name: string;
}

@Injectable()
export class TagFactory {
  /**
   * Instantiates a tag payload object.
   * Standard tags will be trimmed.
   * Custom tags will be trimmed and formatted to start with a Capital letter.
   */
  createTag(name: string, isCustom = false): TagPayload {
    const cleanName = name.replace(/#/g, '').trim(); // Remove hashes if present
    if (isCustom && cleanName.length > 0) {
      const formatted = cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
      return { name: formatted };
    }
    return { name: cleanName };
  }
}
