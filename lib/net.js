'use strict';

exports.ipToInt = function(ip) {
	var i = 0;
	ip = ip.match(
    /^([1-9]\d*|0[0-7]*|0x[\da-f]+)(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?$/i
	); // Verify IP format.
	if (!ip) {
	    return null; // Invalid format.
	}
	ip[0] = 0;
	for (i = 1; i < 5; i += 1) {
	  ip[0] += !! ((ip[i] || '').length);
	  ip[i] = parseInt(ip[i]) || 0;
	}
	ip.push(256, 256, 256, 256);
	ip[4 + ip[0]] *= Math.pow(256, 4 - ip[0]);
	if (ip[1] >= ip[5] || ip[2] >= ip[6] || ip[3] >= ip[7] || ip[4] >= ip[8]) {
		return null;
	}
	return ip[1] * (ip[0] === 1 || 16777216) + ip[2] * (ip[0] <= 2 || 65536) + ip[3] * (ip[0] <= 3 || 256) + ip[4] * 1;
};

exports.intToIp = function(ip) {
	if (!isFinite(ip))return null;
	return [ip >>> 24, ip >>> 16 & 0xFF, ip >>> 8 & 0xFF, ip & 0xFF].join('.');
};
