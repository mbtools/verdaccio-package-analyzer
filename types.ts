export interface TagInfo {
  Tag: string;
  Version: string;
  PublishDate: string;
}

export interface PackageResult {
  Package: string;
  Tags: TagInfo[];
  Error?: string;
}

export interface DistTags {
  [key: string]: string;
}

export interface PackageTime {
  [version: string]: string;
}

export interface NpmPackument {
  'dist-tags': DistTags;
  time: PackageTime;
} 