const {
    getImageNameForLicense,
    isValidLicenseName,
} = require('../license');


test('getImageNameForLicense returns image name when license is supported', () => {
    expect(getImageNameForLicense('cc4.0-by')).toBe('cc4.0-by.png');

    expect(getImageNameForLicense('cc4.0-by-sa')).toBe('cc4.0-by-sa.png');

    expect(getImageNameForLicense('cc4.0-by-nd')).toBe('cc4.0-by-nd.png');

    expect(getImageNameForLicense('cc4.0-by-nc')).toBe('cc4.0-by-nc.png');

    expect(getImageNameForLicense('cc4.0-by-nc-sa')).toBe('cc4.0-by-nc-sa.png');

    expect(getImageNameForLicense('cc4.0-by-nc-nd')).toBe('cc4.0-by-nc-nd.png');
});


test('isValidLicenseName returns true when license is supported', () => {
    expect(isValidLicenseName('cc4.0-by')).toBe(true);

    expect(isValidLicenseName('cc4.0-by-sa')).toBe(true);

    expect(isValidLicenseName('cc4.0-by-nd')).toBe(true);

    expect(isValidLicenseName('cc4.0-by-nc')).toBe(true);

    expect(isValidLicenseName('cc4.0-by-nc-sa')).toBe(true);

    expect(isValidLicenseName('cc4.0-by-nc-nd')).toBe(true);
});
