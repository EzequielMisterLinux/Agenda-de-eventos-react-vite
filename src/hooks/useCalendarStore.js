// useCalendarStore.js
import { useDispatch, useSelector } from "react-redux";
import {
  onAddNewEvent,
  onSetActiveEvent,
  onUpdateEvent,
  onDeleteEvent,
} from "../store/calendar/calendarSlice";

export const useCalendarStore = () => {
  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector((state) => state.calendar);

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  };

  const startSavingEvent = async (calendarEvent) => {
    try {
      if (calendarEvent._id) {
        // Editando evento
        dispatch(onUpdateEvent({ ...calendarEvent }));
      } else {
        // Creando nuevo evento
        dispatch(onAddNewEvent({ ...calendarEvent, _id: new Date().getTime() }));
      }
    } catch (error) {
      console.log(error);
    }

  };

  const startDeletingEvent = () => {
    dispatch(onDeleteEvent);
  }

  return {
    events,
    activeEvent,
    hasEventSelected : !!activeEvent,
    setActiveEvent,
    startDeletingEvent,
    startSavingEvent,
    
  };
};