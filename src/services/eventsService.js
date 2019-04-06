import axios from 'axios';
import moment from 'moment';
import dateFormat from 'dateformat'


const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const apiKey =  process.env.REACT_APP_GOOGLE_APIKEY
const clientId = process.env.REACT_APP_GOOGLE_CLIENTID


// loads the gapi client library and the auth2 library and initizalites it
export async function handleGoogleUser(calendarId, range) {
    window.gapi.load('client:auth2', () => {
        window.gapi.client.init({
            apiKey: apiKey,
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
            clientId: clientId,
            scope: "https://www.googleapis.com/auth/calendar.readonly"
        }).then(() => {
            console.log("gapi lodaded and initialized sucessfully")

            // listen for sign-in state changes
            window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)

            // handle the inital sign-in state
            updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get(), calendarId, range)

        });
    })
}


// gets events for the user by calendarid and range
export async function getEventsById(calendarId, range) {
    console.log(calendarId);

    if (!range || range.length === 0) return null
    const start = range[0];
    const end = range[1];

    const d1 = dateFormat(start, "isoDateTime");
    const d2 = dateFormat(end, "isoDateTime");

    console.log(d1, d2);

    try {
        const response = await window.gapi.client.calendar.events.list({
            'calendarId': calendarId,
            'timeMin': d1,
            'timeMax': d2,
            'orderBy': 'startTime',
            'maxResults': 100,
            'singleEvents': true,
        });

        const events = await days.map(async (day) => {
            const filteredEvents = response.result.items.filter(event => dateFormat(event.start.dateTime, "dddd") === day && event.organizer.email !== "gustavo.e.hernandez@shell.com" && event.summary);
            const promises = await filteredEvents.map(async(event, i) => await getDistances(event, i, filteredEvents));
            const res = await Promise.all(promises);
            console.log(res)
            return { 
                name: day, 
                events: res
              };
        });
    
        const res = await Promise.all(events);
        console.log(res);
        return res;

    } catch (ex) {
        console.log(ex)
    }
};



function updateSigninStatus(isSignedIn, calendarId, range) {
    if (isSignedIn) getEventsById(calendarId, range)
    if (!isSignedIn) window.gapi.auth2.getAuthInstance().signIn()
}

// sign user out
function handleSignInClick() {
    window.gapi.auth2.getAuthInstance().signIn()
}

// sign user in
function handleSignOutClick() {
    window.gapi.auth2.getAuthInstance().signOut()
}


// calculates total distance for each event
export async function getDistances(event, eventIndex, events) {

    if (eventIndex === 0 && eventIndex === events.length -1) {
        const { data } = await axios.get(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=12307+Moretti+Court|${event.location}&destinations=${event.location}|12307+Moretti+Court&key=AIzaSyDCyhZeSmLOgYbJMin3rCH020lA6ArVltI`);
        event.distances = data;
        return event;

    } else if (eventIndex === 0) {
        const { data } = await axios.get(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=12307+Moretti+Court&destinations=${event.location}&key=AIzaSyDCyhZeSmLOgYbJMin3rCH020lA6ArVltI`);
        event.distances = data;
        return event;

    } else if (eventIndex === events.length -1) {
        const { data } = await axios.get(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${events[eventIndex - 1].location}|${event.location}&destinations=${event.location}|12307+Moretti+Court&key=AIzaSyDCyhZeSmLOgYbJMin3rCH020lA6ArVltI`)
        event.distances = data;
        return event;

    } else {
        const { data } = await axios.get(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${events[eventIndex - 1].location}&destinations=${event.location}&key=AIzaSyDCyhZeSmLOgYbJMin3rCH020lA6ArVltI`);
        event.distances = data;
        return event;

    }
}


// Helper Functions
function startOfWeek(date) {
    const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
    console.log(new Date(date.setDate(diff)))
    return new Date(date.setDate(diff));
}


function getWeeksInMonth(month, year){
    var weeks=[],
        firstDate=new Date(year, month, 1),
        lastDate=new Date(year, month+1, 0), 
        numDays= lastDate.getDate();
    
    var start=1;
    var end=7-firstDate.getDay();
    while(start<=numDays){
        weeks.push({start:start,end:end});
        start = end + 1;
        end = end + 7;
        if(end>numDays)
            end=numDays;    
    }        
     return weeks;
 }   

function filterEventsByDay(day, events) {
    const filteredEvents = events.filter(event => dateFormat(event.start.dateTime, "dddd") === this.getDay());
    console.log(filteredEvents);
    return { 
      name: day, 
      events: filteredEvents
    };
  } 
