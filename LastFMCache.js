/*
 *
 * Copyright (c) 2008-2009, Felix Bruns <felixbruns@web.de>
 *
 */

/* Creates a new cache object. */
function LastFMCache() {
    /* Expiration times. */
    const MINUTE = 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;
    const WEEK = DAY * 7;
    const MONTH = WEEK * 4.34812141;
    const YEAR = MONTH * 12;

    /* Methods with weekly expiration. */
    const weeklyMethods = [
        'artist.getSimilar',
        'tag.getSimilar',
        'track.getSimilar',
        'artist.getTopAlbums',
        'artist.getTopTracks',
        'geo.getTopArtists',
        'geo.getTopTracks',
        'tag.getTopAlbums',
        'tag.getTopArtists',
        'tag.getTopTags',
        'tag.getTopTracks',
        'user.getTopAlbums',
        'user.getTopArtists',
        'user.getTopTags',
        'user.getTopTracks'
    ];

    /* Name for this cache. */
    const name = 'lastfm';

    /* Create cache if it doesn't exist yet. */
    if (getObjectFromStorage(localStorage)(name) == null) {
        setObjectToStorage(localStorage, name, {});
    }

    /* Get expiration time for given parameters. */
    this.getExpirationTime = function (params) {
        const method = params.method;

        if ((/Weekly/).test(method) && !(/List/).test(method)) {
            if (typeof (params.to) != 'undefined' && typeof (params.from) != 'undefined') {
                return YEAR;
            }            else {
                return WEEK;
            }
        }

        for (const key in weeklyMethods) {
            if (method == weeklyMethods[key]) {
                return WEEK;
            }
        }

        return -1;
    };

    /* Check if this cache contains specific data. */
    this.contains = function (hash) {
        return typeof (getObjectFromStorage(localStorage, name)[hash]) != 'undefined' &&
            typeof (getObjectFromStorage(localStorage, name)[hash].data) != 'undefined';
    };

    /* Load data from this cache. */
    this.load = function (hash) {
        return getObjectFromStorage(localStorage, name)[hash].data;
    };

    /* Remove data from this cache. */
    this.remove = function (hash) {
        const object = getObjectFromStorage(localStorage, name);

        object[hash] = undefined;

        setObjectToStorage(localStorage, name, object);
    };

    /* Store data in this cache with a given expiration time. */
    this.store = function (hash, data, expiration) {
        const object = getObjectFromStorage(localStorage, name);
        const time = Math.round(new Date().getTime() / 1000);

        object[hash] = {
            data: data,
            expiration: time + expiration
        };

        setObjectToStorage(localStorage, name, object);
    };

    /* Check if some specific data expired. */
    this.isExpired = function (hash) {
        const object = getObjectFromStorage(localStorage, name);
        const time = Math.round(new Date().getTime() / 1000);

        if (time > object[hash].expiration) {
            return true;
        }

        return false;
    };

    /* Clear this cache. */
    this.clear = function () {
        setObjectToStorage(localStorage, name, {});
    };
}

function setObjectToStorage(storage, key, value) {
    storage.setItem(key, JSON.stringify(value));
}

function getObjectFromStorage(storage, key) {
    const item = storage.getItem(key);

    return JSON.parse(item);
}

module.exports = LastFMCache;
