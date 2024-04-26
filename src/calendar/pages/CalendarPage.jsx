// CalendarPage.jsx
import { Calendar } from "react-big-calendar";
import { localizer, getMessagesES } from "../../helpers";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Navbar, CalendarEvent, CalendarModal, FabAddNew, FabDelete } from "../";
import { useState } from "react";
import { useCalendarStore, useUiStore } from "../../hooks";




export const CalendarPage = () => {
  const { openDateModal } = useUiStore();
  const { events, setActiveEvent } = useCalendarStore();
  const [lastView, setLastView] = useState(
    localStorage.getItem("LastView") || "agenda"
  );

  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: "#527375",
      borderRadius: "0px",
      opacity: 0.8,
      color: "white",
    };

    return {
      style,
    };
  };

  const onDoubleClick = (event) => {
    openDateModal();
  };

  const onSelect = (event) => {
    setActiveEvent(event);
  };

  const onViewChange = (event) => {
    localStorage.setItem("LastView", event);
    setLastView(event);
  };

  return (
    <>
      <Navbar />
      <Calendar
        culture="es"
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "calc(100vh - 80px)" }}
        messages={getMessagesES()}
        eventPropGetter={eventStyleGetter}
        components={{ event: CalendarEvent }}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect}
        onView={onViewChange}
        defaultView={lastView}
      />
      <CalendarModal />
      <FabAddNew />
      <FabDelete/>
    </>
  );
};