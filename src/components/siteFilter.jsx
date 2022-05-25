export const stripWhiteSpaces = (siteInput) => {
    siteInput = siteInput.trim();
    siteInput = siteInput.replace(/\s*,?\s*$/, "");
    return siteInput;
};

export const checkInvalidChars = (siteInput) => {
    return /[^\w\s,-.]/g.test(siteInput);
}