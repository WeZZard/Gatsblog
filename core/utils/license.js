const getImageNameForLicense = (license) => {
    if (isValidLicenseName(license)) {
        return `${license}.png`;
    }

    return undefined;
};

const isValidLicenseName =(licenseName) => {
    const trimmedLicenseName = licenseName.trim();

    if (trimmedLicenseName.startsWith('cc4.0-')) {
        const match = /^cc4\.0-(?:(by)|(by-sa)|(by-nd)|(by-nc)|(by-nc-sa)|(by-nc-nd))$/i.exec(trimmedLicenseName);
        if (match) {
            return true;
        }
    }

    return false;
};

module.exports = {
    getImageNameForLicense: getImageNameForLicense,
    isValidLicenseName: isValidLicenseName,
};
