//ANCHOR views
const dayInfoDisplay = document.getElementById("day_display")
const selectWeekDayDiv = document.getElementById("day_btn_holder");
const schedule_container = document.getElementById("schedule_table");

const emptyCalendarElement = "<h4 class='empty_schedule'>Inga lektioner denna dag</h4>"
const scheduleDivider = "<div class='schedule_divider'></div>"


//measurments
const rowHeight = 70


//ANCHOR global variables
const formatTime = (hour, min=0) => hour*60+min
const lessons = [
    {start:formatTime(8), stop:formatTime(11), name:"Matte", room:"Varvsholmen", mClass:"nate19a", day:0},
    {start:formatTime(12,20), stop:formatTime(14,40), name:"Teknik2", room:"Stensö", mClass:"nate18a", day:0},
    {start:formatTime(9,10), stop:formatTime(10,10), name:"Teknik1", room:"Varvsholmen", mClass:"nate19a", day:1},
    {start:formatTime(10, 20), stop:formatTime(12), name:"Matte", room:"Varvsholmen", mClass:"nate19a", day:1},
    {start:formatTime(13), stop:formatTime(13,20), name:"Mentorstid", room:"Varvsholmen", mClass:"nate19a", day:1},
    {start:formatTime(13, 25), stop:formatTime(15), name:"Spanska", room:"Varvsholmen", mClass:"nate19a", day:1},
    {start:formatTime(10, 30), stop:formatTime(12), name:"Teknik5", room:"Varvsholmen", mClass:"nate19a", day:2},
    {start:formatTime(12,1), stop:formatTime(12,40), name:"Teknik7", room:"Varvsholmen", mClass:"nate19a", day:2},
    {start:formatTime(14), stop:formatTime(14,41), name:"Tyska", room:"Varvsholmen", mClass:"nate19a", day:2},
    {start:formatTime(9,10), stop:formatTime(10,10), name:"Teknik1", room:"Varvsholmen", mClass:"nate19a", day:4},
    {start:formatTime(12,20), stop:formatTime(14,40), name:"Matte", room:"Varvsholmen", mClass:"nate19a", day:4}
]
const schoolCloseTime = 18
const noMoreLessons = -1


main()
function main(){
    assignListeners()
    updateScheduleElement(getIndexOfToday())
}

function assignListeners(){
    for(element of selectWeekDayDiv.children){
        element.addEventListener("click", onDayBtnClick);
    }
}

function onDayBtnClick(e){
    e = e || window.event;
    const target = e.target || e.srcElement;

    if(target.nodeName == "LABEL"){
        const indexOfBtn = Array.prototype.indexOf.call(target.parentElement.children, target)
        updateScheduleElement(indexOfBtn)
    }
}


function getIndexOfToday(){
    return new Date().getDay() - 1
}

function updateScheduleElement(dayIndex){
    const validatedDayIndex = getValidatedDayIndex(dayIndex)
    updateSelectedDayInfoElement(validatedDayIndex)
    updateScheduleCalendarElement(validatedDayIndex)
}

function getValidatedDayIndex(dayIndex){
    const Monday = 0
    const Friday = 4

    if(dayIndex < Monday || dayIndex > Friday){
        return Monday
    }
    return dayIndex
}

function updateSelectedDayInfoElement(dayIndex){
    const days = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"]
    dayInfoDisplay.innerHTML = days[dayIndex]
    checkRadioBtnByIndex(dayIndex)
}

function checkRadioBtnByIndex(index){
    const relevantLabel = selectWeekDayDiv.children[index]
    const relevantRadiobutton = relevantLabel.children[0]
    relevantRadiobutton.checked = true
}

function updateScheduleCalendarElement(dayIndex){
    clearScheduleElement()
    const indexOfFirstLessonOfDay = getIndexOfFirstLessonOfDay(dayIndex)
    if (indexOfFirstLessonOfDay === undefined){
        addToScheduleElement(emptyCalendarElement)
        return
    }
    populateCalendarElement(indexOfFirstLessonOfDay, dayIndex)
}

function clearScheduleElement(){
    schedule_container.innerHTML = ""
}

function getIndexOfFirstLessonOfDay(dayIndex){
    for (i = 0; i < lessons.length; i++){
        if (lessons[i].day == dayIndex)
            return i
    }
}

function addToScheduleElement(viewStr){
    schedule_container.innerHTML += viewStr
}

function populateCalendarElement(lessonsStartIndex, dayIndex){
    const hasSpaceForNextLesson = 0
    const noMoreLessonsAndQuitting = -2

    let spanLeftFromPreviousLesson = 0
    let lessonI = lessonsStartIndex
    let lesson = lessons[lessonI]

    const startHour = getStartHourFromLesson(lesson)
    let startHourForLesson = startHour
    let hourI
    let schoolDayEnd = schoolCloseTime
    
    for (hourI = startHour; hourI < schoolDayEnd; hourI++){
        addCalendarHourMarkingElement(hourI)

        if(spanLeftFromPreviousLesson > hasSpaceForNextLesson){
            spanLeftFromPreviousLesson--
            continue
        }
        if(lessonI == noMoreLessons){
            schoolDayEnd = hourI + 1
            lessonI = noMoreLessonsAndQuitting
        }

        if(hourI == startHourForLesson){
            const rowIndex = hourI - startHour + 1;
            [lesson, lessonI, spanLeftFromPreviousLesson, startHourForLesson] = addLessonsInThatHour(lesson, lessonI, startHourForLesson, dayIndex, rowIndex)
        }
        else
            addToScheduleElement(scheduleDivider)
    }
}

function getStartHourFromLesson(lesson){
    return getTimeValuesFromLesson(lesson, true, true)
}

function getTimeValuesFromLesson(lesson, isStart, isHour){
    const anHour = 60
    const relevantTimeValue = isStart ? lesson.start : lesson.stop
    if (isHour)
        return Math.floor(relevantTimeValue / anHour)
    return relevantTimeValue % anHour
}

function addCalendarHourMarkingElement(hour){
    addToScheduleElement(`
    <div class='time_column'>
        <h4>${hour}:00</h4>
    </div>
`)
}

function ranOutOfLessons(lessonI, dayIndex){
    return lessonI >= lessons.length || lessons[lessonI].day != dayIndex
}

function addLessonsInThatHour(inputLesson, inputLessonI, inputLessonStartHour, dayIndex, rowIndex){
    const alreadyMadeSpaceFor = 1

    let spanLeftFromPreviousLesson = addLessonElement(inputLesson, rowIndex) - alreadyMadeSpaceFor
    const lessonI = inputLessonI + 1
    
    if(ranOutOfLessons(lessonI, dayIndex))
        return [undefined, noMoreLessons, spanLeftFromPreviousLesson]

    const lesson = lessons[lessonI]
    const lessonStartHour = getStartHourFromLesson(lesson)
    if(inputLessonStartHour == lessonStartHour){
        return addLessonsInThatHour(lesson, lessonI, lessonStartHour, dayIndex, rowIndex)
    }
    return [lesson, lessonI, spanLeftFromPreviousLesson, lessonStartHour]
}

function addLessonElement(lesson, rowIndex){
    const anHour = 60
    
    const startHour = getStartHourFromLesson(lesson)
    const startMin = getTimeValuesFromLesson(lesson, true, false)
    const stopHour = getTimeValuesFromLesson(lesson, false, true)
    const stopMin = getTimeValuesFromLesson(lesson, false, false)

    const startMargin = (startMin / anHour) * rowHeight
    const lengthInHours = stopHour-startHour
    const span = lengthInHours > 0 ? lengthInHours : 1
    const durationInMinutes = lesson.stop - lesson.start
    const height = durationInMinutes/anHour*rowHeight

    const startTimeStr = `${startHour}:${addLeadingZero(startMin)}`
    const stopTimeStr = `${stopHour}:${addLeadingZero(stopMin)}`
    const smallScheduleItem = durationInMinutes < 40 ? "small_schedule_item" : ""

    addToScheduleElement(`
        <div class="schedule_item ${smallScheduleItem}" style="grid-row: ${rowIndex} / span ${span}; margin-top:${startMargin}px; height: ${height}px">
            <h3>${lesson.name}</h3>
            <p>${lesson.room}</p>
            <p>${lesson.mClass}</p>
            <p>${startTimeStr}-${stopTimeStr}</p>
        </div>
    `)

    return span
}

function addLeadingZero(num){
    return String(num).padStart(2, '0')
}