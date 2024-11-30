var Update = function() {

    'use strict'


    var STABLE_VERSION = '1.0.0'


    var DOWNLOAD_URL = 'https://github.com/susam/quickqwerty/archive/' +
                        STABLE_VERSION + '.zip'


    function parseVersionTokens(vp)
    {
        var tokens = vp.match(/\d+|[a-zA-Z]+/g)
        if (tokens == null) {
            return null
        }

        var i

        for (i = 0; i < tokens.length; i++) {
            var n = parseInt(tokens[i])
            if (!isNaN(n)) {
                tokens[i] = n
            }
        }

        return tokens
    }


    function parseVersion(v)
    {
        var version = {
            main: null,
            pre: null
        }

        var parts = v.split(/-|\+/, 2)

        if (parts.length >= 1) {
            version.main = parseVersionTokens(parts[0])
        }

        if (parts.length >= 2) {
            version.pre = parseVersionTokens(parts[1])
        }

        return version
    }


    function normalizeVersionParts(a, b)
    {
        var i

        if (a.length < b.length) {
            for (i = 0; i < b.length - a.length; i++) {
                a.push(0)
            }
        } else {
            for (i = 0; i < a.length - b.length; i++) {
                b.push(0)
            }
        }
    }


    function compareVersionTokens(a, b)
    {
        if (typeof a == 'number' && typeof b == 'string') {
            return -1
        } else if (typeof a == 'string' && typeof b == 'number') {
            return 1
        } else if (a < b) {
            return -1
        } else if (a > b) {
            return 1
        } else {
            return 0
        }
    }


    function compareVersionParts(a, b)
    {
        if (a.length != b.length) {
            normalizeVersionParts(a, b)
        }

        var i
        var result
        for (i = 0; i < a.length; i++) {
            result = compareVersionTokens(a[i], b[i])
            if (result != 0) {
                return result
            }
        }

        return 0
    }


    function compareVersions(a, b)
    {
        var pa = parseVersion(a)
        var pb = parseVersion(b)

        if (pa.main == null && pb.main == null) {
            return 0
        } else if (pa.main == null) {
            return -1
        } else if (pb.main == null) {
            return 1
        }

        var result = compareVersionParts(pa.main, pb.main)
        if (result != 0) {
            return result
        }

        if (pa.pre == null && pb.pre == null) {
            return 0
        } else if (pa.pre == null) {
            return 1
        } else if (pb.pre == null) {
            return -1
        }

        return compareVersionParts(pa.pre, pb.pre)
    }


    function check()
    {
        if (typeof sessionStorage.update != 'undefined' &&
            sessionStorage.update == 'no') {
            return
        }

        if (typeof Version != 'object' ||
            typeof Tutor.VERSION != 'string') {
            return
        }

        if (compareVersions(STABLE_VERSION, Tutor.VERSION) <= 0) {
            return
        }

        var updateDiv = document.getElementById('update')
        updateDiv.style.display = 'inline-block'

        var thisVersionSpan = document.getElementById('thisVersion')
        thisVersion.innerHTML = Tutor.VERSION

        var stableVersionSpan = document.getElementById('stableVersion')
        stableVersion.innerHTML = STABLE_VERSION

        var downloadLink = document.getElementById('downloadUpdate')
        downloadLink.innerHTML = 'Download QuickQWERTY ' + STABLE_VERSION
        downloadLink.href = DOWNLOAD_URL

        var ignoreLink = document.getElementById('ignoreUpdate')
        ignoreLink.onclick = function()
        {
            updateDiv.style.display = 'none'
            sessionStorage.update = 'no' 
        }
    }


    return {
        check: check
    }
}()
