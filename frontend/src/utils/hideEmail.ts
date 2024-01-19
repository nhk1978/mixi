export const hideEmail = (email: string): string => {
  const [username, domain] = email.split("@");
  const hiddenChars = new Array(username.length - 2).fill("*").join("");
  return `${username[0]}${hiddenChars}${
    username[username.length - 1]
  }@${domain}`;
};
