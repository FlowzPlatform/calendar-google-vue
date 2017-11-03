<template>

  <div id="app">

      <!-- <button @click="refreshEvents">Refresh</button>
    <button v-if="selected._id" @click="removeEvent">Remove</button>
    <button @click="addEvent">Delete token</button>
    
    <pre>{{ selected }}</pre>   -->

    <full-calendar ref="calendar" 
    class="calendarClass"
    defaultView="month"
    :event-sources="eventSources" 
    @event-selected="eventSelected" 
    @event-created="eventCreated" 
    @day-click="dayClick"
    :config="config"></full-calendar>

    <div class="modal-min">
	    <div class="modal-cont">
        <div class="modal-und">
          <div class="modal-but-close" @click='btnCloseDialogue'>x</div>
          <input type="text" class="add-text-inp" v-model='summaryText'>
                  
          <div class="modal-show-date">
          {{ this.selectedDate }}</div>
          <div class="modal-but-bot">
             <button class="mod-bot-butn" @click='insertEvent'>Add</button>
          </div> 
        </div>
      </div>
    </div>

    <div class="modal-del">
	    <div class="modal-cont">
        <div class="modal-und">
          <div class="modal-but-close" @click='btnCloseDialogue'>x</div>
          <input type="text" class="add-text-inp" v-model='$store.state.updateTitle'>
                  
          <div class="modal-show-date">
          {{ this.selectedDate }}</div>
          <div class="modal-but-del">
            <button class="mod-bot-butn" @click='updateEvent'>update</button>
             <button class="mod-bot-butn" @click='deleteEvent'>delete</button>
          </div> 
        </div>
      </div>
    </div>

  </div>
  
</template>

<script>
  /* eslint-disable */
  // eslint-disable-next-line

import moment from 'moment';
import axios from 'axios';
import Vue from 'vue';
import Resource from 'vue-resource';
var _ = require('lodash');
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

const googleURL = 'Write google URL to fetch google calendar list'
const googleAPIKEY = 'Write google API Key here'
const clientID = 'Write google client id here'

Vue.use(Resource)

export default {
  name: 'app',
  created () {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var code = url.searchParams.get('code')
    if (code){
      console.log('code:', code)
      this.getAccessTokenAPI(code)
    }
  },
  data() {
      return {
      
        events: [
          // {
          //   id: 1,
          //   title: 'event1',
          //   start: moment().hours(12).minutes(0),
          // },
          // {
          //   id: 2,
          //   title: 'event2',
          //   start: moment().add(-1, 'days'),
          //   end: moment().add(1, 'days'),
          //   allDay: true,
          // },
          // {
          //   id: 3,
          //   title: 'event3',
          //   start: moment().add(2, 'days'),
          //   end: moment().add(2, 'days').add(6, 'hours'),
          //   allDay: false,
          // },
          // {
          //   id: 4,
          //   title: 'event 4',
          //   start: moment().add(3, 'days'),
          //   end: moment().add(3, 'days').add(3, 'hours')
          // }
        ],
        config: {
          eventClick: (event) => {
            console.log('event clicked: ', event)
            this.$store.state.eId = event.id
            this.$store.commit('eId')
            this.$store.state.updateTitle = event.title
            this.$store.commit('updateTitle')
            $('.modal-del').addClass('opens')
            this.selectedDate = moment(event.start._d).format('LL');

            this.$store.state.updateStartDt = moment(event.start._d).format('YYYY-MM-DD')
            this.$store.state.updateEndDt = moment(event.start._d).format('YYYY-MM-DD')
            this.$store.commit('updateStartDt')
            this.$store.commit('updateEndDt')
          },
        },
        selectedDate: '',
        summaryText: '',
        selected: {},
        eventObj: {
          _id: 100,
          title: 'dynamic event',
          start: moment().add(-3, 'days'),
          end: moment().add(-3, 'days').add(5, 'hours')
        }
      };
    },
    methods: {
      googleAuthURL() {
        if(this.$store.state.token.length > 0){
          this.manageOperations()
        }else {
          window.location = 'https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/plus.login&access_type=offline&include_granted_scopes=true&state=state_parameter_passthrough_value&redirect_uri=http://localhost:8080/oauthCallback&response_type=code&prompt=consent&client_id=' + clientID
        }
      },
      btnCloseDialogue() {
        $('.modal-min').removeClass('opens')
        $('.modal-del').removeClass('opens')
      },
      insertEvent() {
        console.log('summary:', this.summaryText)
        this.$store.state.eventTitle = this.summaryText
        this.$store.commit('eventTitle')
        $('.modal-min').removeClass('opens')
        this.$store.state.eventOps = 'INSERT'
        this.$store.commit('eventOps')
        this.googleAuthURL()
      },
      deleteEvent() {
        $('.modal-del').removeClass('opens')
        this.$store.state.eventOps = 'DELETE'
        this.$store.commit('eventOps')
        this.googleAuthURL()
      },
      updateEvent() {
        $('.modal-del').removeClass('opens')
        this.$store.state.eventOps = 'UPDATE'
        this.$store.commit('eventOps')
        this.googleAuthURL()
      },
      refreshEvents() {
        this.$refs.calendar.$emit('refetch-events');
      },
      removeEvent() {
        this.$refs.calendar.$emit('remove-event', this.selected);
        this.selected = {};
      },
      addEvent() {
        this.$store.state.token = ''
        this.$store.commit('token')
        
      },
      addEventToGCalendar (){
        // console.log('gcalCode:', gcalCode)
        // this.$http.post('/getAccessToken', {
        //         code: gcalCode
        //     }).then(response => {
        //       this.$store.state.token = response.data.token_type + ' ' + response.data.access_token
        //       this.$store.commit('token')
        //       console.log('token: ', this.$store.state.token)
        //       console.log('startDt:', this.$store.state.startDate)
        //       console.log('endDt:', this.$store.state.endDate)
        //      // var summaryText = 'Event added for ' + this.$store.state.startDate
        //   })
        var self = this
        axios.post(googleURL, {
                "summary": this.$store.state.eventTitle,
                "start": {
                  "date": this.$store.state.startDate
                },
                "end": {
                  "date": this.$store.state.endDate
                }
              },{
                headers: {
                  'Authorization': this.$store.state.token
                }
              })
              .then(function (response) {
                console.log('response: ', response);
                window.location = 'http://localhost:8080'

                // this.$refs.calendar.$emit('render-event', this.eventObj);
                // this.selected = this.eventObj;
              })
              .catch(function (error) {
                if(error.response.status === 401){
                  console.log('error:', error.response.status);
                  self.$http.post('/getTokenFromRefreshToken', {
                    refresh_token: self.$store.state.refreshToken
                  })
                  .then(response => {
                    var obj = JSON.parse(response.data)
                    console.log('obj:', obj['access_token'])
                    
                    self.$store.state.token = obj['token_type'] + ' ' + obj['access_token']
                    self.$store.commit('token')
                    self.addEventToGCalendar()
                  })
                }
              });
      },
      updateEventToGCalendar() {
        var self = this;
        var url = googleURL + '/' + this.$store.state.eId
        axios.put(url, {
                "summary": this.$store.state.updateTitle,
                "start": {
                  "date": this.$store.state.updateStartDt
                },
                "end": {
                  "date": this.$store.state.updateEndDt
                }
              },{
                headers: {
                  'Authorization': this.$store.state.token
                }
              })
              .then(function (response) {
                console.log('response: ', response);
                window.location = 'http://localhost:8080'
                // this.$refs.calendar.$emit('render-event', this.eventObj);
                // this.selected = this.eventObj;
              })
              .catch(function (error) {
                if(error.response.status === 401){
                  console.log('error:', error.response.status);
                  self.$http.post('/getTokenFromRefreshToken', {
                    refresh_token: self.$store.state.refreshToken
                  })
                  .then(response => {
                    var obj = JSON.parse(response.data)
                    console.log('obj:', obj['access_token'])
                    
                    self.$store.state.token = obj['token_type'] + ' ' + obj['access_token']
                    self.$store.commit('token')
                    self.updateEventToGCalendar()
                  })
                }
              });
      },
      deleteEventToGCalendar() {
        var self = this
        var url = googleURL + '/' + this.$store.state.eId
            axios.delete(url, {
                headers: {
                  'Authorization': this.$store.state.token
                }
              })
              .then(function (response) {
                console.log('event deleted:', response)
                window.location = 'http://localhost:8080'
                // this.$refs.calendar.$emit('remove-event', event);
                // this.selected = event;
              })
              .catch(function (error) {
                
                if(error.response.status === 401){
                  console.log('error:', error.response.status);
                  self.$http.post('/getTokenFromRefreshToken', {
                    refresh_token: self.$store.state.refreshToken
                  })
                  .then(response => {
                    var obj = JSON.parse(response.data)
                    console.log('obj:', obj['access_token'])
                    
                    self.$store.state.token = obj['token_type'] + ' ' + obj['access_token']
                    self.$store.commit('token')
                    self.deleteEventToGCalendar()
                  })
                }
              });
      },
      getAccessTokenAPI(gcalCode) {
        console.log('gcalCode:', gcalCode)
        this.$http.post('/getAccessToken', {
                code: gcalCode
            }).then(response => {
              this.$store.state.token = response.data.token_type + ' ' + response.data.access_token
              this.$store.commit('token')
              this.$store.state.refreshToken = response.data.refresh_token
              this.$store.commit('refreshToken')
              console.log('resp: ', response)
              console.log('startDt:', this.$store.state.startDate)
              console.log('endDt:', this.$store.state.endDate)

              this.manageOperations()
          })
      },
      manageOperations() {
        var operation = this.$store.state.eventOps;
        switch(operation){
          case 'INSERT':
            console.log('inside insert')
            this.$store.state.eventOps = ''
            this.$store.commit('eventOps')
            this.addEventToGCalendar()
          break;
          case 'UPDATE':
            this.$store.state.eventOps = ''
            this.$store.commit('eventOps')
            this.updateEventToGCalendar()
          break;
          case 'DELETE':
            this.$store.state.eventOps = ''
            this.$store.commit('eventOps')
            this.deleteEventToGCalendar()
          break;
          default:
        }
      },
      eventSelected(event) {
        console.log('event: ', event);
        this.selected = event;
      },

      dayClick(date, jsEvent, view) {
       
      },

      eventCreated(...test) {
        this.$store.state.startDate = moment(test[0].start._d).format('YYYY-MM-DD')
        this.$store.state.endDate = moment(test[0].end._d).format('YYYY-MM-DD')
        this.$store.commit('startDate')
        this.$store.commit('endDate')

        this.selectedDate = moment(this.$store.state.startDate).format('LL');

        $('.modal-min').addClass('opens')

        // console.log('add event: ', this.eventObj)
        // this.$refs.calendar.$emit('render-event', this.eventObj);
        // this.selected = this.eventObj;

      },
      getEvents(self,callback){
        axios.get( googleURL + '?key=' + googleAPIKEY)
          .then(function (response) {
              var obj;
              var temp;
              let _events = [];

              self.$refs.calendar.$emit('reload-events')

              for(obj in response.data.items){
                let _googleEventObj = {
              id: '',
              title: '',
              start: '',
              end: ''
              }
                temp =response.data.items[obj];
  
                _googleEventObj.id = temp.id
                _googleEventObj.title = temp.summary
                if(temp.start.dateTime){
                  _googleEventObj.start =temp.start.dateTime
                }else if(temp.start.date){
                  _googleEventObj.start =temp.start.date
                }
                if(temp.end.dateTime){
                  _googleEventObj.end =temp.end.dateTime
                }else if(temp.end.date){
                  _googleEventObj.end =temp.end.date
                }

                var findEvent = _.find(self.$store.state.arrAllEvents, ['id', _googleEventObj.id])
                
                if(!findEvent) {
                  self.$store.dispatch('addEvent', _googleEventObj)
                }else{
                  self.$refs.calendar.$emit('remove-event', findEvent);
                }
                self.$refs.calendar.$emit('render-event', _googleEventObj);
              // _events.push(_googleEventObj)
              //  console.log('events count: ',_events)
              }
              callback(self.events);
            })
            .catch(function (error) {
              console.log('error: ', error)
            })
      }
    },

    computed: {
      eventSources() {
        const self = this;
        return [
          {
            events(start, end, timezone, callback) {
              self.getEvents(self,callback)
              setInterval(function(){
                self.getEvents(self,callback)
              }, 10000);
            },
          },
        ];
      },
    }
}
</script>

<style>

@import '~fullcalendar/dist/fullcalendar.css';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
