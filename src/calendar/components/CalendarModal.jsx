// CalendarModal.jsx
import { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import "./styles.css";
import { addHours, differenceInSeconds } from "date-fns";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale/es";
import Swal from "sweetalert2";
import { useCalendarStore, useUiStore } from "../../hooks";

registerLocale("es", es);

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    width: "500px",
    height: "800px",
    bottom: "auto",
    borderRadius: "5px",
    backgroundColor: "white",
  },
};

Modal.setAppElement("#root");

export const CalendarModal = () => {
  const { isDateModalOpen, closeDateModal } = useUiStore();
  const { activeEvent, startSavingEvent } = useCalendarStore();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formValues, setFormValues] = useState({
    title: "",
    notes: "",
    start: new Date(),
    end: addHours(new Date(), 2),
  });

  const titleClass = useMemo(() => {
    if (!formSubmitted) return "";
    return formValues.title.length > 0 ? "is-valid" : "is-invalid";
  }, [formValues.title, formSubmitted]);

  useEffect(() => {
    if (activeEvent !== null) {
      setFormValues({ ...activeEvent });
    }
  }, [activeEvent]);

  const onInputChanged = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };

  const onDateChanged = (event, changing) => {
    setFormValues({
      ...formValues,
      [changing]: event,
    });
  };

  const onCloseModal = () => {
    closeDateModal();
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);

    const difference = differenceInSeconds(formValues.end, formValues.start);

    if (isNaN(difference) || difference <= 0) {
      Swal.fire({
        icon: "error",
        title: "Error en las fechas",
        text: "La fecha de fin debe ser mayor a la fecha de inicio",
      });
      return;
    }

    if (formValues.title.length <= 0) {
      Swal.fire({
        icon: "error",
        title: "Error en el título",
        text: "Es necesario asignarle un nombre al evento",
      });
      return;
    }

    await startSavingEvent(formValues);
    closeDateModal();
    setFormSubmitted(false);
  };

  return (
    <Modal
      isOpen={isDateModalOpen}
      onRequestClose={onCloseModal}
      style={customStyles}
      className="Modal"
      overlayClassName="modal-fondo"
      closeTimeoutMS={400}
    >
      <h2>Nuevo evento</h2>
      <hr />
      <form className="container" onSubmit={onSubmit}>
        <div className="form-group mb-2">
          <label>Fecha y hora de inicio </label>
          <DatePicker
            selected={formValues.start}
            className="form-control"
            onChange={(event) => onDateChanged(event, "start")}
            dateFormat="Pp"
            showTimeSelect
            locale="es"
            timeCaption="hora"
          />
        </div>
        <div className="form-group mb-2">
          <label>Fecha y hora de fin </label>
          <DatePicker
            minDate={formValues.start}
            selected={formValues.end}
            className="form-control"
            onChange={(event) => onDateChanged(event, "end")}
            dateFormat="Pp"
            showTimeSelect
            locale="es"
            timeCaption="hora"
          />
        </div>
        <hr />
        <div className="form-group mb-2">
          <label>Título y notas</label>
          <input
            type="text"
            placeholder="título del evento"
            className={`form-control ${titleClass}`}
            autoComplete="off"
            value={formValues.title}
            onChange={onInputChanged}
            name="title"
          />
          <small className="form-text text-muted">descripción corta</small>
        </div>
        <div className="form-group mb-2">
          <textarea
            name="notes"
            type="text"
            className="form-control"
            placeholder="notas"
            rows="5"
            value={formValues.notes}
            onChange={onInputChanged}
          ></textarea>
          <small className="form-text text-muted">información adicional</small>
        </div>
        <button type="submit" className="btn btn-outline-primary btn-block">
          <i className="far fa-save"></i>
          &nbsp;
          <span>guardar</span>
        </button>
      </form>
    </Modal>
  );
};