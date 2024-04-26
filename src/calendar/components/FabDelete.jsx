import { useCalendarStore } from '../../hooks';
import './fabaddnew.css';


export const FabDelete = () => {
    const {startDeletingEvent, hasEventSelected } = useCalendarStore();

    const isDateModalOpen = () => {
        startDeletingEvent()
        
    }

    const handleDelete = () => {
        startDeletingEvent();

    }

    return (
        <button className="btn btn-danger fab-danger"
        onClick={handleDelete}
        style={{
            display: hasEventSelected && !isDateModalOpen ? '' : 'none'
        }}>
            <i className="fas fa-trash-alt"></i>
        </button>
    )
}