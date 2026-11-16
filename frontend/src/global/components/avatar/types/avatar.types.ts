export type PrefabAvatarSize =
  | 'sm'
  | 'md'
  | 'lg';

export interface PrefabAvatarProps {
  uri?: string;

  size?: PrefabAvatarSize;
}