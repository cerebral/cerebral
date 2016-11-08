import {Duration, LocalTime, ZonedDateTime, ZoneId, ZoneOffset} from 'js-joda'

const SYSTEM = ZoneId.SYSTEM

// All public API takes a string and returns a string
const parse = ZonedDateTime.parse

const parseHere = (utcDateString) => (
  ZonedDateTime.parse(utcDateString).withZoneSameInstant(SYSTEM)
)

export const now = () => (
  ZonedDateTime.now(ZoneOffset.UTC).toString()
)

const todayHere = () => (
  ZonedDateTime.now(SYSTEM)
)

export const sortDayString = (dateString) => dateString.substr(0, 10)

let dayMap = {}

const specialDayNames = () => {
  const today = todayHere()
  const todayDate = sortDayString(today.toString())
  if (dayMap[todayDate] !== 'Today') {
    dayMap[todayDate] = 'Today'
    dayMap[sortDayString(today.minusDays(1).toString())] = 'dayago1'
    dayMap[sortDayString(today.minusDays(2).toString())] = 'dayago2'
  }
  return dayMap
}

export const displayDate = (dateString, t) => {
  const hereDate = parseHere(dateString)
  const dayDate = sortDayString(hereDate.toString())
  const specialDayName = specialDayNames()[dayDate]
  if (specialDayName) {
    return t[specialDayName]
  }
  const dayName = t[`Dow${hereDate.dayOfWeek().value()}`]
  const day = hereDate.dayOfMonth()
  const monthName = t[`Mon${hereDate.monthValue()}`]
  const thisYear = todayHere().year()
  const year = hereDate.year()
  return `${dayName}, ${day} ${monthName}${thisYear === year ? '' : ` ${year}`}`
}

export const displayTime = (dateString) => {
  const time = parseHere(dateString)
  const h = time.hour()
  const m = time.minute()
  return `${h}:${m < 10 ? '0' : ''}${m}`
}

const displayTimeWithSeconds = (time) => {
  const h = time.hour()
  const m = time.minute()
  const s = time.second()
  return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
}

export const displayElapsed = (seconds) => (
  displayTimeWithSeconds(LocalTime.ofSecondOfDay(seconds))
)

export const elapsedSeconds = (fromDateTimeString, toDateTimeString) => {
  const fromDateTime = parse(fromDateTimeString)
  const toDateTime = parse(toDateTimeString)
  return Duration.between(fromDateTime, toDateTime).seconds()
}
