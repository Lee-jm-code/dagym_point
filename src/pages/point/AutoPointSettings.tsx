import { useState, useEffect } from 'react';
import { Gift, RefreshCw, Calendar, Megaphone, Settings, X, Check, Cake, Trophy, Award } from 'lucide-react';
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
    pointType: 'fixed',
    percentageRate: 5,
    randomMin: 500,
    randomMax: 2000,
    allowDuplicate: false,
  },
  {
    id: '2',
    eventType: 'RE_REGISTRATION',
    eventName: '재등록',
    description: '기존 회원이 재등록 시 포인트를 자동 지급합니다.',
    isActive: true,
    pointAmount: 2000,
    pointType: 'fixed',
    percentageRate: 5,
    randomMin: 1000,
    randomMax: 3000,
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
    pointType: 'fixed',
    randomMin: 50,
    randomMax: 200,
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
    pointType: 'fixed',
    randomMin: 1000,
    randomMax: 5000,
    allowDuplicate: false,
    startDate: '2026-01-01',
    endDate: '2026-01-31',
  },
  {
    id: '5',
    eventType: 'BIRTHDAY',
    eventName: '생일',
    description: '회원 생일에 포인트를 자동 지급합니다.',
    isActive: false,
    pointAmount: 3000,
    pointType: 'fixed',
    randomMin: 1000,
    randomMax: 5000,
    allowDuplicate: false,
  },
  {
    id: '6',
    eventType: 'CONSECUTIVE_ATTENDANCE',
    eventName: '연속 출석',
    description: '연속 출석 달성 시 포인트를 자동 지급합니다.',
    isActive: false,
    pointAmount: 2000,
    pointType: 'fixed',
    randomMin: 500,
    randomMax: 3000,
    allowDuplicate: true,
    duplicateCondition: '달성 시마다',
    customNumber: 7,
  },
  {
    id: '7',
    eventType: 'ANNIVERSARY',
    eventName: '회원가입 주년',
    description: '회원가입 주년 기념 포인트를 자동 지급합니다.',
    isActive: false,
    pointAmount: 5000,
    pointType: 'fixed',
    randomMin: 2000,
    randomMax: 10000,
    allowDuplicate: true,
    duplicateCondition: '매 주년마다',
    customNumber: 1,
  },
];

const percentageCapableEvents = ['NEW_REGISTRATION', 'RE_REGISTRATION'];

const eventIcons: Record<string, React.ReactNode> = {
  NEW_REGISTRATION: <Gift size={24} />,
  RE_REGISTRATION: <RefreshCw size={24} />,
  ATTENDANCE: <Calendar size={24} />,
  PROMOTION: <Megaphone size={24} />,
  BIRTHDAY: <Cake size={24} />,
  CONSECUTIVE_ATTENDANCE: <Trophy size={24} />,
  ANNIVERSARY: <Award size={24} />,
};

const STORAGE_KEY = 'auto_point_settings';
const TOGGLE_KEY = 'auto_point_enabled';

const loadStoredEvents = (): AutoPointEvent[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as AutoPointEvent[];
    } catch {
      return initialEvents;
    }
  }
  return initialEvents;
};

const loadStoredToggle = (): boolean => {
  const stored = localStorage.getItem(TOGGLE_KEY);
  if (stored !== null) {
    return stored === 'true';
  }
  return true;
};

const AutoPointSettings = () => {
  const [events, setEvents] = useState<AutoPointEvent[]>(loadStoredEvents);
  const [editingEvent, setEditingEvent] = useState<AutoPointEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutoPointEnabled, setIsAutoPointEnabled] = useState(loadStoredToggle);
  const [customNumberInput, setCustomNumberInput] = useState('');
  const [percentageInput, setPercentageInput] = useState('');
  const [randomMinInput, setRandomMinInput] = useState('');
  const [randomMaxInput, setRandomMaxInput] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(TOGGLE_KEY, String(isAutoPointEnabled));
  }, [isAutoPointEnabled]);

  const toggleEvent = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, isActive: !event.isActive } : event
    ));
  };

  const openEditModal = (event: AutoPointEvent) => {
    setEditingEvent({ ...event });
    setCustomNumberInput(String(event.customNumber ?? ''));
    setPercentageInput(String(event.percentageRate ?? ''));
    setRandomMinInput(String(event.randomMin ?? ''));
    setRandomMaxInput(String(event.randomMax ?? ''));
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

      {/* 자동 지급 토글 */}
      <div className="auto-point-toggle-section">
        <label className="auto-point-toggle">
          <input
            type="checkbox"
            checked={isAutoPointEnabled}
            onChange={(e) => setIsAutoPointEnabled(e.target.checked)}
          />
          <span className="custom-checkbox">
            {isAutoPointEnabled && <Check size={14} />}
          </span>
          <span className="toggle-text">설정대로 자동으로 포인트를 지급합니다.</span>
        </label>
        <div className="auto-point-description">
          <p>자동 포인트 지급 기능을 켜두시면 아래 설정의 조건이 충족될 때</p>
          <p>회원님들께 자동으로 포인트를 지급해 편하고 효과적인 마케팅을 진행하실 수 있습니다.</p>
        </div>
      </div>

      <div className={`events-list ${!isAutoPointEnabled ? 'disabled' : ''}`}>
        {events.map(event => (
          <div key={event.id} className={`event-card ${event.isActive && isAutoPointEnabled ? 'active' : 'inactive'}`}>
            <div className="event-card-main">
              <div className="event-icon-wrapper">
                {eventIcons[event.eventType]}
              </div>
              
              <div className="event-info">
                <div className="event-header">
                  <h3 className="event-name">{event.eventName}</h3>
                  <span className={`event-status ${event.isActive && isAutoPointEnabled ? 'on' : 'off'}`}>
                    {event.isActive && isAutoPointEnabled ? 'ON' : 'OFF'}
                  </span>
                </div>
                <p className="event-description">
                  {event.eventType === 'CONSECUTIVE_ATTENDANCE'
                    ? `${event.customNumber || 7}일 연속 출석 달성 시 포인트를 자동 지급합니다.`
                    : event.eventType === 'ANNIVERSARY'
                    ? `회원가입 ${event.customNumber || 1}주년 기념 포인트를 자동 지급합니다.`
                    : event.description}
                </p>
                
                <div className="event-details">
                  <div className="detail-item">
                    <span className="detail-label">지급 방식</span>
                    <span className="detail-value">
                      {event.pointType === 'random' ? '랜덤' : event.pointType === 'percentage' && percentageCapableEvents.includes(event.eventType) ? '정률' : '정액'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">
                      {event.pointType === 'random'
                        ? '랜덤 범위'
                        : event.pointType === 'percentage' && percentageCapableEvents.includes(event.eventType)
                        ? '적립률'
                        : '지급 포인트'}
                    </span>
                    <span className="detail-value highlight">
                      {event.pointType === 'random'
                        ? `${(event.randomMin || 0).toLocaleString()}P ~ ${(event.randomMax || 0).toLocaleString()}P`
                        : event.pointType === 'percentage' && percentageCapableEvents.includes(event.eventType)
                        ? `${event.percentageRate || 0}%`
                        : `${event.pointAmount.toLocaleString()}P`}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">중복 지급</span>
                    <span className="detail-value">
                      {event.allowDuplicate ? `가능 (${event.duplicateCondition})` : '불가'}
                    </span>
                  </div>
                  {event.eventType === 'CONSECUTIVE_ATTENDANCE' && (
                    <div className="detail-item">
                      <span className="detail-label">연속 출석 일수</span>
                      <span className="detail-value highlight">{event.customNumber || 7}일</span>
                    </div>
                  )}
                  {event.eventType === 'ANNIVERSARY' && (
                    <div className="detail-item">
                      <span className="detail-label">주년</span>
                      <span className="detail-value highlight">{event.customNumber || 1}주년</span>
                    </div>
                  )}
                  {event.startDate && event.endDate && (
                    <div className="detail-item">
                      <span className="detail-label">기간</span>
                      <span className="detail-value">{event.startDate} ~ {event.endDate}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="event-actions">
                <label className={`toggle-switch ${!isAutoPointEnabled ? 'disabled' : ''}`}>
                  <input 
                    type="checkbox" 
                    checked={event.isActive}
                    onChange={() => toggleEvent(event.id)}
                    disabled={!isAutoPointEnabled}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <button 
                  className="edit-btn" 
                  onClick={() => openEditModal(event)}
                  disabled={!isAutoPointEnabled}
                >
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
                <label className="form-label">지급 방식</label>
                <div className="radio-group">
                  <label className="radio-item">
                    <input
                      type="radio"
                      name="pointType"
                      checked={!editingEvent.pointType || editingEvent.pointType === 'fixed'}
                      onChange={() => setEditingEvent({
                        ...editingEvent,
                        pointType: 'fixed'
                      })}
                    />
                    <span>정액 지급</span>
                  </label>
                  {percentageCapableEvents.includes(editingEvent.eventType) && (
                    <label className="radio-item">
                      <input
                        type="radio"
                        name="pointType"
                        checked={editingEvent.pointType === 'percentage'}
                        onChange={() => setEditingEvent({
                          ...editingEvent,
                          pointType: 'percentage'
                        })}
                      />
                      <span>정률 지급</span>
                    </label>
                  )}
                  <label className="radio-item">
                    <input
                      type="radio"
                      name="pointType"
                      checked={editingEvent.pointType === 'random'}
                      onChange={() => setEditingEvent({
                        ...editingEvent,
                        pointType: 'random'
                      })}
                    />
                    <span>랜덤 지급</span>
                  </label>
                </div>
              </div>

              {editingEvent.pointType === 'random' ? (
                <div className="form-group">
                  <label className="form-label">랜덤 포인트 범위</label>
                  <div className="random-range-inputs">
                    <div className="input-with-suffix">
                      <input
                        type="text"
                        inputMode="numeric"
                        className="form-input"
                        value={randomMinInput}
                        onChange={e => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          setRandomMinInput(val);
                          setEditingEvent({
                            ...editingEvent,
                            randomMin: parseInt(val) || 0
                          });
                        }}
                        placeholder="최소"
                      />
                      <span className="input-suffix">P</span>
                    </div>
                    <span className="range-separator">~</span>
                    <div className="input-with-suffix">
                      <input
                        type="text"
                        inputMode="numeric"
                        className="form-input"
                        value={randomMaxInput}
                        onChange={e => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          setRandomMaxInput(val);
                          setEditingEvent({
                            ...editingEvent,
                            randomMax: parseInt(val) || 0
                          });
                        }}
                        placeholder="최대"
                      />
                      <span className="input-suffix">P</span>
                    </div>
                  </div>
                  <p className="form-hint">최소 {(editingEvent.randomMin || 0).toLocaleString()}P ~ 최대 {(editingEvent.randomMax || 0).toLocaleString()}P 사이에서 랜덤으로 지급됩니다.</p>
                </div>
              ) : editingEvent.pointType === 'percentage' && percentageCapableEvents.includes(editingEvent.eventType) ? (
                <div className="form-group">
                  <label className="form-label">적립률 (받은 금액 기준)</label>
                  <div className="input-with-suffix">
                    <input
                      type="text"
                      inputMode="numeric"
                      className="form-input"
                      value={percentageInput}
                      onChange={e => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setPercentageInput(val);
                        setEditingEvent({
                          ...editingEvent,
                          percentageRate: parseInt(val) || 0
                        });
                      }}
                      placeholder="0"
                    />
                    <span className="input-suffix">%</span>
                  </div>
                  <p className="form-hint">상품 배정 시 받은 금액의 {editingEvent.percentageRate || 0}%가 포인트로 적립됩니다.</p>
                </div>
              ) : (
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
              )}

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

              {editingEvent.eventType === 'CONSECUTIVE_ATTENDANCE' && (
                <div className="form-group">
                  <label className="form-label">연속 출석 일수</label>
                  <div className="input-with-suffix">
                    <input
                      type="text"
                      inputMode="numeric"
                      className="form-input"
                      value={customNumberInput}
                      onChange={e => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setCustomNumberInput(val);
                        setEditingEvent({
                          ...editingEvent,
                          customNumber: parseInt(val) || 0
                        });
                      }}
                    />
                    <span className="input-suffix">일</span>
                  </div>
                </div>
              )}

              {editingEvent.eventType === 'ANNIVERSARY' && (
                <div className="form-group">
                  <label className="form-label">주년</label>
                  <div className="input-with-suffix">
                    <input
                      type="text"
                      inputMode="numeric"
                      className="form-input"
                      value={customNumberInput}
                      onChange={e => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setCustomNumberInput(val);
                        setEditingEvent({
                          ...editingEvent,
                          customNumber: parseInt(val) || 0
                        });
                      }}
                    />
                    <span className="input-suffix">주년</span>
                  </div>
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

