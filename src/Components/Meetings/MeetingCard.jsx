import React, { useState, useRef } from 'react';
import { Modal } from 'antd';
import { QrReader } from 'react-qr-reader';
import { Calendar, Clock, Users, AlertCircle, Edit, Trash2, Play, PauseCircle, CheckCircle, Eye } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'today':
                return 'bg-blue-100 text-blue-800';
            case 'started':
                return 'bg-green-100 text-green-800';
            case 'ended':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
            {status}
        </span>
    );
};

const MeetingCard = ({ meeting, onEdit, onDelete, onStartMeeting, onPostpone, onMarkAttendance, onEndMeeting, onView }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const videoRef = useRef(null);


    const handleMarkAttendance = () => {
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        window.location.reload();
    };

    const renderActions = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return (
                    <div className="flex space-x-2 mt-4">
                        <button onClick={() => onEdit(meeting.id)} className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
                            <Edit className="w-4 h-4 inline mr-1" /> Edit
                        </button>
                        <button onClick={() => onDelete(meeting.id)} className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600">
                            <Trash2 className="w-4 h-4 inline mr-1" /> Delete
                        </button>
                    </div>
                );
            case 'today':
                return (
                    <div className="flex space-x-2 mt-4">
                        <button onClick={() => onStartMeeting(meeting.id)} className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600">
                            <Play className="w-4 h-4 inline mr-1" /> Start Meeting
                        </button>
                        <button onClick={() => onPostpone(meeting.id)} className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600">
                            <PauseCircle className="w-4 h-4 inline mr-1" /> Postpone Meeting
                        </button>
                    </div>
                );
            case 'started':
                return (
                    <div className="flex space-x-2 mt-4">
                        <button onClick={handleMarkAttendance} className="bg-purple-500 text-white px-3 py-2 rounded hover:bg-purple-600">
                            <CheckCircle className="w-4 h-4 inline mr-1" /> Mark Attendance
                        </button>
                        <button onClick={() => onEndMeeting(meeting.id)} className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600">
                            <CheckCircle className="w-4 h-4 inline mr-1" /> End Meeting
                        </button>
                        <button onClick={() => onView(meeting.id)} className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
                            <Eye className="w-4 h-4 inline mr-1" /> View
                        </button>
                    </div>
                );
            case 'ended':
                return (
                    <div className="flex space-x-2 mt-4">
                        <button onClick={() => onView(meeting.id)} className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
                            <Eye className="w-4 h-4 inline mr-1" /> View
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{meeting.name}</h3>
                <StatusBadge status={meeting.status} />
            </div>

            <p className="text-gray-600 mb-4">{meeting.purpose}</p>

            <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(meeting.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</span>
                </div>

                <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{meeting.startTime} - {meeting.endTime}</span>
                </div>

                {meeting.participants && (
                    <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{meeting.participants - (meeting.absents || 0)} / {meeting.participants} attending</span>
                    </div>
                )}

                <div className="flex items-center text-gray-600">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span>{meeting.notice}</span>
                </div>
            </div>

            {renderActions(meeting.status)}

            <Modal
                title="QR Code Scanner"
                visible={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
            >
                {isModalVisible && (
                    <QrReader
                        constraints={{ facingMode: 'environment' }}
                        ref={videoRef}
                        onResult={(result, error) => {
                            if (result) {
                                alert(`Scanned result: ${result.text}`);
                                handleModalClose();
                            }
                            if (error) {
                                console.error(error);
                            }
                        }}
                        style={{ width: '100%' }}
                    />
                    
                )}
            </Modal>

        </div>
    );
};

export default MeetingCard;
