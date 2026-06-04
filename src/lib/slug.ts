const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

export function createSlug(length = 8) {
  let slug = "";
  for (let index = 0; index < length; index += 1) {
    slug += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return slug;
}
