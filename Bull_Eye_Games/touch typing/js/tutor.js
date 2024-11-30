var Tutor = function() {

    'use strict'

    var VERSION = '1.0.1-dev'

    var my = {

        html: {
            unitLinks: null,

            subunitLinks: null,

            unitTitle: null,

            alternateUnitLinks: null,

            guideLink: null,

            guide: null,

            practicePanelWrapper: null,

            practicePane: null,

            previousLink: null,

            nextLink: null,

            target: null,

            input: null,

            status: null,

            remark: null,

            advice: null,

            progress: null,

            progressBar: null,

            progressPercent: null,

            restartLink: null,

            speed: null,

            error: null,

            smiley: null
        },

        current: {
            unitNo: 0,

            subunitNo: 0,

            unit: null,

            subunitTitles: [],

            subunitText: '',

            targetPrefix: '',

            targetChar: '',

            targetSuffix: '',

            startTime: 0,

            errors: 0,

            correctInputLength: 0,

            timeElapsed: 0,

            wpm: 0,

            cpm: 0,

            errorRate: 0,

            state: null
        },

        settings: {
            unit: '',
        },

        logFunction: null,

        UNIT: {
            MAIN: 'main',
            ALTERNATE: 'alternate'
        },

        STATE: {
            READY: "ready",

            RUNNING: "running",

            ERROR: "error",

            COMPLETED: "completed"
        },

        SMILEY: {
            VERY_HAPPY: '(\uff61\u0298\u203f\u0298\uff61)',

            HAPPY: '(\u0298\u203f\u0298)',

            UNHAPPY: '(\u2299_\u2299)',

            SAD: '(\u2299\u2054\u2299)'
        }
    }


    function init()
    {
        for (var elementID in my.html) {
            my.html[elementID] = document.getElementById(elementID)
        }

        resetSettings()
        loadSettings()

        showPracticePanelWrapper()
        updateUnitFromURL()
        hideGuide()

        window.onhashchange = processURLChange
        my.html.input.onkeyup = updatePracticePane
        guideLink.onclick = toggleGuide
    }


    function setLogFunction(logFunction)
    {
        my.logFunction = logFunction
    }


    function log()
    {
        if (my.logFunction == null)
            return

        var meta = ['name', 'QuickQWERTY']
        var data = Array.prototype.slice.call(arguments)
        my.logFunction.apply(this, meta.concat(data))
    }


    function resetSettings()
    {
        my.settings.unit = my.UNIT.MAIN
    }


    function loadSettings()
    {
        if (typeof localStorage.unit != 'undefined') {
            my.settings.unit = localStorage.unit
        }
    }


    function unit(m)
    {
        if (alternateUnitAvailable(m) &&
            my.settings.unit == my.UNIT.ALTERNATE) {
            return Units.alternate[m - Units.alternateStart]
        } else {
            return Units.main[m - 1]
        }
    }


    function alternateUnitAvailable(m)
    {
        if (m >= Units.alternateStart &&
            m < Units.alternateStart + Units.alternate.length) {
            return true
        } else {
            return false
        }
    }


    function showPracticePanelWrapper()
    {
        my.html.practicePanelWrapper.style.display = 'inline-block'
    }


    function displayUnitLinks()
    {
        var linksDiv = my.html.unitLinks
        Util.removeChildren(linksDiv)

        for (var i = 0; i < Units.main.length; i++) {
            var label = 'Unit ' + (i + 1)
            var selected = (i + 1 == my.current.unitNo)
            var href = unitHref(i + 1)

            var divElement = boxedLink(label, selected, href)
            divElement.id = 'unit' + (i + 1)
            divElement.title = unit(i + 1).title

            linksDiv.appendChild(divElement)
        }
    }


    function boxedLink(label, selected, href, clickHandler)
    {
        var divElement = document.createElement('div')

        if (selected) {
            var spanElement = document.createElement('span')
            Util.addChildren(spanElement, label)
            divElement.appendChild(spanElement)

            divElement.className = 'selected'
        } else {
            var anchorElement = document.createElement('a')
            anchorElement.href = href
            Util.addChildren(anchorElement, label)

            if (typeof clickHandler != 'undefined') {
                anchorElement.onclick = clickHandler
            }

            divElement.appendChild(anchorElement)
        }

        return divElement
    }


    function unitHref(m, n)
    {
        if (typeof m == 'undefined') {
            return ''
        } else if (typeof n == 'undefined') {
            return '#' + m
        } else {
            return '#' + m + '.' + n
        }
    }


    function processURLChange()
    {
        switch(window.location.hash) {

            case '#restart':
                currentSubunit()
                break

            case '#previous':
                previousSubunit()
                break

            case '#next':
                nextSubunit()
                break

            default:
                updateUnitFromURL()
        }
    }


    function currentSubunit()
    {
        var m = my.current.unitNo
        var n = my.current.subunitNo

        window.location.href = unitHref(m, n)
    }


    function currentSubunitIsTheFirstSubunit()
    {
        return my.current.unitNo == 1 && my.current.subunitNo == 1
    }


    function currentSubunitIsTheLastSubunit()
    {
        return my.current.unitNo == Units.main.length &&
               my.current.subunitNo == my.current.subunitTitles.length
    }


    function previousSubunit()
    {
        var m = my.current.unitNo
        var n = my.current.subunitNo

        if (!currentSubunitIsTheFirstSubunit()) {
            if (n == 1) {
                previousUnit = unit(m - 1)
                var previousSubunitTitles = []
                for (var subunitTitle in previousUnit.subunits) {
                    previousSubunitTitles.push(subunitTitle)
                }

                m--
                n = previousSubunitTitles.length
            } else {
                n--
            }
        }

        window.location.href = unitHref(m, n)
    }


    function nextSubunit()
    {
        var m = my.current.unitNo
        var n = my.current.subunitNo

        if (!currentSubunitIsTheLastSubunit()) {
            if (n == my.current.subunitTitles.length) {
                m++
                n = 1
            } else {
                n++
            }
        }

        window.location.href = unitHref(m, n)
    }


    function hideGuide()
    {
        guide.style.display = 'none'
        Util.setChildren(guideLink, 'Guide')
        return false
    }


    function showGuide()
    {
        guide.style.display = ''
        Util.setChildren(guideLink, 'Hide Guide')
        return false
    }


    function toggleGuide()
    {
        if (guide.style.display == 'none') {
            return showGuide()
        } else {
            return hideGuide()
        }
    }


    function updateUnitFromURL()
    {
        var unitNo = 1
        var subunitNo = 1

        if (window.location.hash.length > 0) {
            var fragmentID = window.location.hash.slice(1)
            var tokens = fragmentID.split('.')
            unitNo = parseInt(tokens[0])
            if (tokens.length > 1)
                subunitNo = parseInt(tokens[1])
        }

        if (isNaN(unitNo)) {
            unitNo = 1
        }

        if (isNaN(subunitNo)) {
            subunitNo = 1
        }

        setSubunit(unitNo, subunitNo)

        displayUnitLinks()
        displaySubunitLinks()
        displayAlternateUnitLinks()
        updateNavigationLinks()
        updateProgressTooltip()

        displayUnitTitle()
        displayGuide()

        resetSubunit()
    }


    function updateNavigationLinks()
    {
        if (currentSubunitIsTheFirstSubunit()) {
            my.html.previousLink.style.visibility = 'hidden'
            my.html.nextLink.style.visibility = 'visible'
        } else if (currentSubunitIsTheLastSubunit()) {
            my.html.previousLink.style.visibility = 'visible'
            my.html.nextLink.style.visibility = 'hidden'
        } else {
            my.html.previousLink.style.visibility = 'visible'
            my.html.nextLink.style.visibility = 'visible'
        }
    }


    function updateProgressTooltip()
    {
        my.html.progress.title =
                'This lesson contains ' + my.current.subunitText.length +
                ' characters.'
    }


    function displayAlternateUnitLinks()
    {
        if (!alternateUnitAvailable(my.current.unitNo)) {
            alternateUnitLinks.style.visibility = 'hidden'
            return
        }

        Util.removeChildren(alternateUnitLinks)

        var mainUnitElement =
                boxedLink(Units.mainLabel,
                          my.settings.unit == my.UNIT.MAIN,
                          '#', toggleUnit)

        var alternateUnitElement =
                boxedLink(Units.alternateLabel,
                          my.settings.unit == my.UNIT.ALTERNATE,
                          '#', toggleUnit)

        alternateUnitLinks.appendChild(mainUnitElement)
        alternateUnitLinks.appendChild(alternateUnitElement)
        alternateUnitLinks.style.visibility = 'visible'
    }


    function toggleUnit()
    {
        var newUnit
        var confirmMessage

        if (my.settings.unit == my.UNIT.MAIN) {
            newUnit = my.UNIT.ALTERNATE
            confirmMessage = Units.alternateConfirmMessage
        } else {
            newUnit = my.UNIT.MAIN
            confirmMessage = Units.mainConfirmMessage
        }

        if (!confirm(confirmMessage)) {
            return false
        }

        localStorage.unit = newUnit
        loadSettings()
        updateUnitFromURL()
        return false
    }


    function resetSubunit()
    {
        my.current.state = my.STATE.READY
        my.current.errors = 0
        my.html.input.value = ''

        log('state', my.current.state.toUpperCase(),
            'unit', my.current.unitNo + '.' + my.current.subunitNo,
            'type', my.settings.unit)

        updatePracticePaneState()
        updatePracticePane()
        clearAdvice()
        clearResultTooltips()
    }


    function setSubunit(m, n)
    {
        my.current.unitNo = m
        my.current.subunitNo = n

        my.current.unit = unit(m)

        my.current.subunitTitles.length = 0
        for (var subunitTitle in my.current.unit.subunits) {
            my.current.subunitTitles.push(subunitTitle)
        }

        var subunitTitle = my.current.subunitTitles[n - 1]
        my.current.subunitText = my.current.unit.subunits[subunitTitle]
    }


    function displaySubunitLinks()
    {
        var linksDiv = my.html.subunitLinks
        while (linksDiv.firstChild &&
               linksDiv.firstChild.className != 'stretch') {

            linksDiv.removeChild(linksDiv.firstChild)
        }

        var numberOfSubunits = my.current.subunitTitles.length
        for (var i = numberOfSubunits - 1; i >= 0; i--) {
            var whitespace = document.createTextNode('\n')
            linksDiv.insertBefore(whitespace, linksDiv.firstChild)

            var label = my.current.subunitTitles[i]
            var selected = (i + 1 == my.current.subunitNo)
            var href = unitHref(my.current.unitNo, i + 1)

            var subunitDiv = boxedLink(label, selected, href)
            subunitDiv.id = 'subunit' + (i + 1)
            subunitDiv.style.width = (95 / numberOfSubunits) + '%'

            linksDiv.insertBefore(subunitDiv, linksDiv.firstChild)
        }
    }


    function displayUnitTitle() {

        var unitNo = 'Unit ' + my.current.unitNo +
                     '.' + my.current.subunitNo
        var space = '\u00a0\u00a0'
        var title = '[' + my.current.unit.title + ']'

        Util.setChildren(my.html.unitTitle, unitNo, space, title)
    }


    function displayGuide() {
       my.html.guide.innerHTML = my.current.unit.guide
    }


    function setTargetText() {

        var targetLength = Settings.TARGET_TEXT_LENGTH
        if (targetLength < 1) {
            targetLength = 1
        }

        if (targetLength % 2 == 0) {
            targetLength--
        }

        var prefixLength = (targetLength - 1) / 2

        var i = my.current.correctInputLength
        var textLength = my.current.subunitText.length
        if (i <= prefixLength) {
            var startIndex = 0
        } else if (i >= textLength - 1 - prefixLength) {
            var startIndex = textLength - targetLength
        } else {
            var startIndex = i - prefixLength
        }
        var endIndex = startIndex + targetLength

        var s = my.current.subunitText.substring(startIndex, i)
        my.current.targetPrefix = Util.visual(s)

        if (i < textLength) {
            s = my.current.subunitText.charAt(i)
            my.current.targetChar = Util.visual(s)
        } else {
            my.current.targetChar = ''
        }

        s = my.current.subunitText.substring(i + 1, endIndex)
        my.current.targetSuffix = Util.visual(s)
    }


    function displayTargetText()
    {
        var targetCharElement = document.createElement('span')
        var targetChar = document.createTextNode(my.current.targetChar)
        targetCharElement.className = 'targetChar'
        targetCharElement.appendChild(targetChar)

        Util.setChildren(my.html.target, my.current.targetPrefix,
                                         targetCharElement,
                                         my.current.targetSuffix)
    }


    function updatePracticePane()
    {
        evaluateInput()
        setTargetText()
        displayTargetText()
        updateProgress()
        updateSpeed()
        updateError()
        updateSmiley()

        if (my.current.state == my.STATE.COMPLETED) {
            displayAdvice()
            setResultTooltips()

            log('state', my.current.state.toUpperCase(),
                'unit', my.current.unitNo + '.' + my.current.subunitNo,
                'type', my.settings.unit,
                'wpm', my.current.wpm,
                'error', my.current.errorRate.toFixed(1))
        }
    }


    function evaluateInput()
    {
        var inputText = my.html.input.value
        var inputLength = inputText.length

        if (my.current.state == my.STATE.READY && inputLength > 0) {

            my.current.startTime = new Date().getTime()
            my.current.state = my.STATE.RUNNING
            updatePracticePaneState()

            log('state', my.current.state.toUpperCase(),
                'unit', my.current.unitNo + '.' + my.current.subunitNo,
                'type', my.settings.unit)
        }

        var goodChars = Util.common(my.current.subunitText, inputText)
        my.current.correctInputLength = goodChars

        if (goodChars == inputLength) {

            if (my.current.state == my.STATE.ERROR) {

                my.current.state = my.STATE.RUNNING
                updatePracticePaneState()
            }
        } else {

            if (my.current.state == my.STATE.RUNNING) {
                my.current.state = my.STATE.ERROR
                my.current.errors++
                updatePracticePaneState()
            } else if (my.current.state == my.STATE.ERROR) {
                processInputCommand()
            }
        }

        if (goodChars == 0) {
            if (my.current.errors == 0) {
                my.current.errorRate = 0
            } else {
                my.current.errorRate = Number.POSITIVE_INFINITY
            }
        } else {
            my.current.errorRate = 100 * my.current.errors / goodChars
        }

        if (goodChars == my.current.subunitText.length) {
            my.current.state = my.STATE.COMPLETED
            updatePracticePaneState()
        }
    }


    function updatePracticePaneState()
    {
        switch (my.current.state) {

            case my.STATE.READY:
                my.html.practicePane.className = ''
                my.html.input.disabled = false
                my.html.input.focus()
                Util.setChildren(my.html.status, 'READY')
                my.html.status.title = 'Type in the input box below ' +
                                       'to begin this lesson.'
                my.html.restartLink.style.visibility = 'hidden'
                break

            case my.STATE.RUNNING:
                my.html.practicePane.className = ''
                my.html.input.disabled = false
                my.html.input.focus()
                Util.setChildren(my.html.status, '')
                my.html.status.title = ''
                my.html.restartLink.style.visibility = 'visible'
                break

            case my.STATE.ERROR:
                my.html.practicePane.className = 'error'
                my.html.input.disabled = false
                my.html.input.focus()
                my.html.restartLink.style.visibility = 'visible'
                Util.setChildren(my.html.status, 'ERROR!')
                my.html.status.title = 'Fix errors in the input box ' +
                                       'by pressing the backspace key.'
                break

            case my.STATE.COMPLETED:
                my.html.practicePane.className = 'completed'
                my.html.input.disabled = true
                my.html.input.blur()
                my.html.restartLink.style.visibility = 'visible'
                Util.setChildren(my.html.status, 'COMPLETED')
                my.html.status.title = 'You have completed this lesson.'
                break
        }

    }


    function clearAdvice()
    {
        Util.removeChildren(my.html.remark)
        Util.removeChildren(my.html.advice)
    }


    function displayAdvice()
    {
        var error = Math.round(my.current.errorRate)

        var repeatSubunit = error > 0

        var anchorElement = document.createElement('a')
        if (repeatSubunit) {
            Util.addChildren(my.html.remark, 'Reduce error')
            my.html.remark.title = 'Your error rate should not ' +
                                   'exceed 0%.'

            Util.addChildren(anchorElement, 'Try again')
            anchorElement.href = '#restart'
            anchorElement.title = 'Please practice this lesson again.'
        } else {
            Util.addChildren(my.html.remark, 'Well done!')
            my.html.remark.title = 'You have satisfactorily ' +
                                   'completed this lesson.'

            Util.addChildren(anchorElement, 'Next lesson')
            anchorElement.href = '#next'
            anchorElement.title = 'Please proceed with the next lesson.'
        }

        if (repeatSubunit || !currentSubunitIsTheLastSubunit()) {
            my.html.advice.appendChild(anchorElement)
            anchorElement.focus()
        }
    }


    function updateProgress()
    {
        var goodChars = my.current.correctInputLength
        var textLength = my.current.subunitText.length

        var progress = Math.round(100 * goodChars / textLength)

        my.html.progressBar.value = progress
        Util.setChildren(my.html.progressPercent, progress + '%')
    }


    function updateSpeed()
    {
        if (my.current.state == my.STATE.ERROR) {
            return
        }

        var goodChars = my.current.correctInputLength

        var currentTime = new Date().getTime()
        var timeElapsed = currentTime - my.current.startTime
        my.current.timeElapsed = timeElapsed

        var wpm
        if (timeElapsed == 0) {
            wpm = goodChars == 0 ? 0 : '\u221e'
        } else {
            wpm = Math.round(60000 * goodChars / 5 / timeElapsed)
            my.current.wpm = wpm
            my.current.cpm = Math.round(60000 * goodChars / timeElapsed)
        }

        Util.setChildren(my.html.speed, wpm + ' wpm')
    }

    function updateError()
    {
        var goodChars = my.current.correctInputLength

        var errorRate
        var errorRateTooltip
        var accuracyTooltip

        if (my.current.errorRate == Number.POSITIVE_INFINITY) {
            errorRate = '\u221e'
        } else {
            errorRate = Math.round(my.current.errorRate)
        }

        Util.setChildren(my.html.error, errorRate + '% error')
    }


    function updateSmiley()
    {
        var errorRate = Math.round(my.current.errorRate)
        var smiley

        if (errorRate == 0) {
            if (my.current.wpm >= 40) {
                smiley = my.SMILEY.VERY_HAPPY
            } else {
                smiley = my.SMILEY.HAPPY
            }
        } else if (errorRate > 0 && errorRate <= 2) {
            smiley = my.SMILEY.UNHAPPY
        } else {
            smiley = my.SMILEY.SAD
        }
        Util.setChildren(my.html.smiley, smiley)
    }


    function clearResultTooltips()
    {
        my.html.speed.title = ''
        my.html.error.title = ''
    }

    function setResultTooltips()
    {
        var textLength = my.current.subunitText.length
        var charNoun = textLength == 1 ? 'character' : 'characters'

        my.html.speed.title =
                'You have typed ' + textLength + ' ' + charNoun +
                ' in\n' +
                Util.prettyTime(my.current.timeElapsed) + '.\n\n' +
                'Your typing speed is\n' +
                my.current.wpm + ' words per minute, or\n' +
                my.current.cpm + ' characters per minute.'


        var errorRateTooltip
        var accuracyTooltip

        if (my.current.errorRate == Number.POSITIVE_INFINITY) {
            errorRateTooltip = '\u221e'
            accuracyTooltip = 0
        } else {
            errorRateTooltip = parseFloat(my.current.errorRate.toFixed(1))
            accuracyTooltip = 100 - errorRateTooltip
        }

        var errorNoun = my.current.errors == 1 ? 'error' : 'errors'

        var title =
                'You have typed ' + textLength + ' ' + charNoun +
                '.\n' +
                'You have made ' + my.current.errors + ' ' +
                errorNoun + '.\n' +
                'Your error rate is ' + errorRateTooltip + '%.\n' +
                'Your accuracy is ' + accuracyTooltip + '%.\n'

        my.html.error.title = title
    }


    function processInputCommand()
    {
        var inputText = my.html.input.value
        var goodChars = my.current.correctInputLength

        if (inputCommandIs('restart') || inputCommandIs('rst')) {
            location.href = '#restart'
        } else if (inputCommandIs('fix') || inputCommandIs('xxx')){
            my.html.input.value = inputText.substring(0, goodChars)
            updatePracticePane()
        } else if (inputCommandIs('qtpi')) {
            qtpi()
        }
    }


    function inputCommandIs(command)
    {
        var input = my.html.input.value
        return input.substring(input.length - command.length) == command
    }


    function createHeart()
    {
        var span = document.createElement('span')

        span.style.position = 'absolute'
        span.style.color = '#f52887'
        span.style.opacity = '0'
        Util.addChildren(span, '\u2665')

        document.body.appendChild(span)
        return span
    }


    function growingHearts()
    {
        var ox = 0
        var oy = 80

        var w = document.body.clientWidth - ox - 200
        var h = document.body.clientHeight - oy - 200

        var newInterval = Util.random(200, 2000)

        window.setInterval(function()
        {

            var heart = createHeart()
            heart.style.fontSize = '0%'
            heart.style.left = Util.random(ox, ox + w) + 'px'
            heart.style.top = Util.random(oy, oy + h) + 'px'

            var growInterval = Util.random(10, 50)
            var size = Util.random(200, 2000)
            var i = 0
            var id = window.setInterval(function()
            {
                i += 20
                heart.style.fontSize = i + '%'

                if (i < size / 2 ) {
                    heart.style.opacity = '1'
                } else {
                    heart.style.opacity = (1 - (2 * i - size) / size ) + ''
                }

                if (i >= size) {
                    window.clearInterval(id)
                    document.body.removeChild(heart)
                }
            }, growInterval)
        }, newInterval)
    }


    function risingHearts()
    {
        var ox = 0
        var oy = 80

        var w = document.body.clientWidth - ox - 200
        var h = document.body.clientHeight - oy - 200

        var newInterval = Util.random(200, 2000)

        window.setInterval(function()
        {
            var x = Util.random(ox, ox + w)
            var y = Util.random(oy + h - 100, oy + h)

            var heart = createHeart()
            heart.style.fontSize = Util.random(100, 2000) + '%'
            heart.style.left = x + 'px'
            heart.style.top = y + 'px'

            var riseInterval = Util.random(10, 50)
            var rise = Util.random(h / 4, h)
            var drift = Util.random(-1, 1)
            var i = 0
            var id = window.setInterval(function()
            {
                i++
                if (Util.random(1, 100) <= 1) {
                    drift = (drift == Util.random(-1, 1) ? 1 : 0)
                }

                x = Math.min(Math.max(x + drift, ox), ox + w)

                heart.style.left = x + 'px'
                heart.style.top = (y - i) + 'px'

                if (i < rise / 4) {
                    heart.style.opacity = (4 * i / rise) + ''
                } else if (i < rise / 2 ) {
                    heart.style.opacity = '1'
                } else {
                    heart.style.opacity = (1 - (2 * i - rise) / rise ) + ''
                }

                if (i >= rise) {
                    window.clearInterval(id)
                    document.body.removeChild(heart)
                }
            }, riseInterval)
        }, newInterval)
    }


    function qtpiLetter()
    {
        var pLeft = '<p style="text-align: left">'
        var pCenter = '<p style="text-align: center">'
        var pRight = '<p style="text-align: right">'
        var pEnd = '</p>'

        var d = new Date()
        var meridiem = d.getHours() < 12 ? 'a.m.' : 'p.m.'

        if (d.getMinutes() == 14 && (d.getHours() == 3 ||
                                     d.getHours() == 15)) {

            return pLeft + 'Cutie Pai,' + pEnd + pCenter +
                   'Happy <big style="font-family: serif">&pi;</big> ' +
                   meridiem + pEnd + pRight + '&mdash; Susam' + pEnd
        }

        var letters = [
            pLeft + 'Cutie Pai,' + pEnd + pCenter +
            'I <span style="color: #f52887; font-size: 110%">&#x2764;' +
            '</span> U!' + pEnd + pRight + '&mdash; Susam' + pEnd,

            pLeft + 'Cutie Pai,' + pEnd + pCenter +
            'I <span style="color: #f52887; font-size: 130%">&hearts;' +
            '</span> U!' + pEnd + pRight + '&mdash; Susam' + pEnd,

            pLeft + 'Cutie Pai,' + pEnd + pCenter +
            'I love you! <span style="color: #f52887;">' +
            '<span style="font-size: 60%">&hearts;</span>' +
            '<span style="font-size: 100%">&hearts;</span></span>' +
            pEnd + pRight + '&mdash; Susam' + pEnd,

            pLeft + 'Cutie Pai,' + pEnd + pLeft +
            'Your smile is the most beautiful thing in the ' +
            'world to me. <big style="color: #a53364">&#x263a;</big>' +
            pEnd + pRight + '&mdash; Susam' + pEnd,

            pLeft + 'Cutie Pai,' + pEnd + pLeft +
            'Do you know why I got the tiny wine glass for you at ' +
            'Purple Haze?' + pEnd + pLeft +
            'Because I can go to any length to see you smile.' +
            pEnd + pRight + '&mdash; Susam' + pEnd,

            pLeft + 'Cutie Pai,' + pEnd + pCenter +
            'You make me want to be a better person.' +
            pEnd + pRight + '&mdash; Susam' + pEnd
        ]

        return Util.random(letters)
    }


    function qtpi()
    {
        document.getElementById('content').style.display = 'none'
        document.getElementById('sidebar').style.display = 'none'

        var letterDiv = document.createElement('div')
        letterDiv.style.width = '50%'
        letterDiv.style.marginLeft = 'auto'
        letterDiv.style.marginRight = 'auto'
        letterDiv.style.borderColor = '#2e0854'
        letterDiv.style.borderWidth = '5px'
        letterDiv.style.borderStyle = Util.random(['solid', 'double',
                                                   'ridge', 'groove'])
        var fontSize = 32
        letterDiv.style.fontSize = fontSize + 'px'
        letterDiv.style.lineHeight = (1.5 * fontSize) + 'px'
        letterDiv.style.paddingLeft = fontSize + 'px'
        letterDiv.style.paddingRight = fontSize + 'px'
        letterDiv.style.color = '#2e0854'
        Util.addChildren(letterDiv, qtpiLetter())

        var letter = qtpiLetter()
        letterDiv.innerHTML = letter

        var mainDiv = document.getElementById('main')
        mainDiv.appendChild(letterDiv)

        var verticalMargin = (window.innerHeight -
                              0.04 * window.innerWidth -
                              letterDiv.offsetHeight - 160) / 2

        if (verticalMargin <= 20) {
            verticalMargin = '2%'
        } else {
            verticalMargin = Math.round(verticalMargin) + 'px'
        }

        letterDiv.style.marginTop = verticalMargin
        letterDiv.style.marginBottom = verticalMargin

        Util.random([growingHearts, risingHearts, function(){}])()
        log('qtpi', letter.replace(/(<([^>]+)>)/ig, ' '))
    }


    return {
        VERSION: VERSION,
        init: init,
        setLogFunction: setLogFunction
    }
}()
