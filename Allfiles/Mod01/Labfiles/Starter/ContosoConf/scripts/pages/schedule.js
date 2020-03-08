﻿import { ScheduleList } from "../ScheduleList.js";
import { LocalStarStorage } from "../LocalStarStorage.js";

const scheduleListElement = document.getElementById("schedule");
const scheduleList = new ScheduleList(
    scheduleListElement,
    new LocalStarStorage(localStorage)
);
scheduleList.startDownload();
