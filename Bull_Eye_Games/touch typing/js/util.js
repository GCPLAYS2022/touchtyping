var Util = function() {

    'use strict'


    function common(a, b)
    {
        var minLength = Math.min(a.length, b.length)
        for (var i = 0; i < minLength; i++) {
            if (a.charAt(i) != b.charAt(i)) {
                return i
            }
        }
        return i
    }


    function random(a, b)
    {
        if (typeof a == 'number') {
            if (typeof b == 'number') {
                a = Math.floor(a)
                b = Math.floor(b)
                return Math.floor(Math.random() * (b - a + 1)) + a
            } else {
                return Number.NaN
            }
        } else if (a instanceof Array) {
            return a[Math.floor(Math.random() * a.length)]
        }
    }


    function prettyTime(milliseconds, showMilliseconds)
    {
        if (typeof showMilliseconds == 'undefined') {
            showMilliseconds = true
        }

        seconds = Math.floor(milliseconds / 1000)
        minutes = Math.floor(seconds / 60)
        hours = Math.floor(minutes / 60)
        days = Math.floor(hours / 24)


        milliseconds %= 1000
        seconds %= 60
        minutes %= 60
        hours %= 24

        seconds += (milliseconds / 1000)

        var s = ''

        if (days != 0) {
            s += days + ' day' + (days > 1 ? 's' : '') + ' '
        }

        if (hours != 0) {
            s += hours + ' hour' + (hours > 1 ? 's' : '') + ' '
        }

        if (minutes != 0) {
            s += minutes + ' minute' + (minutes > 1 ? 's' : '') + ' '
        }

        if (seconds != 0) {
            s += seconds.toFixed(showMilliseconds ? 3 : 0) +
                 ' second' + (seconds > 1 ? 's' : '') + ' '
        }

        if (s.length == 0) {
            return '0 second'
        } else {
            return s.substring(0, s.length - 1)
        }
    }


    function visual(s)
    {
        return s.replace(/ /g, '\u00a0').replace(/\n/g, '\u23ce')
    }


    function addChildren()
    {
        if (arguments.length <= 1) {
            return
        }

        var node = arguments[0]
        var childNodes = Array.prototype.slice.call(arguments, 1)
        var childNode
        var i

        for (i = 0; i < childNodes.length; i++) {
            childNode = childNodes[i]

            if (childNode instanceof Node) {
                node.appendChild(childNode)
            } else {
                node.appendChild(document.createTextNode(childNode + ''))
            }
        }
    }


    function removeChildren(node)
    {
        while (node.firstChild) {
            node.removeChild(node.firstChild)
        }
    }


    function setChildren()
    {
        if (arguments.length <= 1) {
            return
        }

        removeChildren(arguments[0])
        addChildren.apply(null, arguments)
    }


    return {
        common: common,
        random: random,
        prettyTime: prettyTime,
        addChildren: addChildren,
        setChildren: setChildren,
        removeChildren: removeChildren,
        visual: visual
    }
}()
