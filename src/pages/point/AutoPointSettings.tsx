import { useState } from 'react';
import { Gift, RefreshCw, Calendar, Megaphone, Settings, X } from 'lucide-react';
import type { AutoPointEvent } from '../../types/point';
import './AutoPointSettings.css';

const initialEvents: AutoPointEvent[] = [
  {
    id: '1',
    eventType: 'NEW_REGISTRATION',
    eventName: '신규 등록',
    description: '신규 회원 등록 시 포인트를 자동 지급합니다.',
    isActive: true,
    pointAmount: 1000,
    allowDuplicate: false,
  },
  {
    id: '2',
    eventType: 'RE_REGISTRATION',
    eventName: '재등록',
    description: '기존 회원이 재등록 시 포인트를 자동 지급합니다.',
    isActive: true,
    pointAmount: 2000,
    allowDuplicate: true,
    duplicateCondition: '재등록마다',
  },
  {
    id: '3',
    eventType: 'ATTENDANCE',
    eventName: '출석',
    description: '회원 출석 시 포인트를 자동 지급합니다.',
    isActive: true,
    pointAmount: 100,
    allowDuplicate: true,
    duplicateCondition: '1일 1회',
  },
  {
    id: '4',
    eventType: 'PROMOTION',
    eventName: '프로모션',
    description: '프로모션 기간 동안 특별 포인트를 지급합니다.',
    isActive: false,
    pointAmount: 5000,
    allowDuplicate: false,
    startDate: '2026-01-01',
    endDate: '2026-01-31',
  },
];

const eventIcons: Record<string, React.ReactNode> = {
  NEW_REGISTRATION: <Gift size={24} />,
  RE_REGISTRATION: <RefreshCw size={24} />,
  ATTENDANCE: <Calendar size={24} />,
  PROMOTION: <Megaphone size={24} />,
};

const AutoPointSettings = () => {
  const [events, setEvents] = useState<AutoPointEvent[]>(initialEvents);
  const [editingEvent, setEditingEvent] = useState<AutoPointEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleEvent = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, isActive: !event.isActive } : event
    ));
  };

  const openEditModal = (event: AutoPointEvent) => {
    setEditingEvent({ ...event });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const saveEvent = () => {
    if (!editingEvent) return;
    setEvents(events.map(event => 
      event.id === editingEvent.id ? editingEvent : event
    ));
    closeModal();
  };

  return (
    <div className="auto-point-settings">
      <div className="page-header">
        <h1 className="page-title">자동 지급 설정</h1>
        <p className="page-description">
          이벤트 발생 시 자동으로 포인트가 지급되도록 설정합니다.
        </p>
      </div>

      <div className="events-list">
        {events.map(event => (
          <div key={event.id} className={`event-card ${event.isActive ? 'active' : 'inactive'}`}>
            <div className="event-card-main">
              <div className="event-icon-wrapper">
                {eventIcons[event.eventType]}
              </div>
              
              <div className="event-info">
                <div className="event-header">
                  <h3 className="event-name">{event.eventName}</h3>
                  <span className={`event-status ${event.isActive ? 'on' : 'off'}`}>
                    {event.isActive ? 'ON' : 'OFF'}
                  </span>
                </div>
                <p className="event-description">{event.description}</p>
                
                <div className="event-details">
                  <div className="detail-item">
                    <span className="detail-label">지급 포인트</span>
                    <span className="detail-value highlight">{event.pointAmount.toLocaleString()}P</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">중복 지급</span>
                    <span className="detail-value">
                      {event.allowDuplicate ? `가능 (${event.duplicateCondition})` : '불가'}
                    </span>
                  </div>
                  {event.startDate && event.endDate && (
                    <div className="detail-item">
                      <span className="detail-label">기간</span>
                      <span className="detail-value">{event.startDate} ~ {event.endDate}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="event-actions">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={event.isActive}
                    onChange={() => toggleEvent(event.id)}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <button className="edit-btn" onClick={() => openEditModal(event)}>
                  <Settings size={18} />
                  설정 수정
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 수정 모달 */}
      {isModalOpen && editingEvent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingEvent.eventName} 설정</h2>
              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">지급 포인트</label>
                <div className="input-with-suffix">
                  <input
                    type="number"
                    className="form-input"
                    value={editingEvent.pointAmount}
                    onChange={e => setEditingEvent({
                      ...editingEvent,
                      pointAmount: parseInt(e.target.value) || 0
                    })}
                  />
                  <span className="input-suffix">P</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">중복 지급</label>
                <div className="radio-group">
                  <label className="radio-item">
                    <input
                      type="radio"
                      name="allowDuplicate"
                      checked={!editingEvent.allowDuplicate}
                      onChange={() => setEditingEvent({
                        ...editingEvent,
                        allowDuplicate: false
                      })}
                    />
                    <span>불가</span>
                  </label>
                  <label className="radio-item">
                    <input
                      type="radio"
                      name="allowDuplicate"
                      checked={editingEvent.allowDuplicate}
                      onChange={() => setEditingEvent({
                        ...editingEvent,
                        allowDuplicate: true
                      })}
                    />
                    <span>가능</span>
                  </label>
                </div>
              </div>

              {editingEvent.allowDuplicate && (
                <div className="form-group">
                  <label className="form-label">중복 조건</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingEvent.duplicateCondition || ''}
                    placeholder="예: 1일 1회, 재등록마다"
                    onChange={e => setEditingEvent({
                      ...editingEvent,
                      duplicateCondition: e.target.value
                    })}
                  />
                </div>
              )}

              {editingEvent.eventType === 'PROMOTION' && (
                <>
                  <div className="form-group">
                    <label className="form-label">시작일</label>
                    <input
                      type="date"
                      className="form-input"
                      value={editingEvent.startDate || ''}
                      onChange={e => setEditingEvent({
                        ...editingEvent,
                        startDate: e.target.value
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">종료일</label>
                    <input
                      type="date"
                      className="form-input"
                      value={editingEvent.endDate || ''}
                      onChange={e => setEditingEvent({
                        ...editingEvent,
                        endDate: e.target.value
                      })}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>취소</button>
              <button className="btn-save" onClick={saveEvent}>저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoPointSettings;

