import { useState } from 'react';
import { Check, HelpCircle } from 'lucide-react';
import './AutoPointSettings.css';

interface AutoPointItem {
  id: string;
  label: string;
  description: string;
  isActive: boolean;
  hasTimeSettings?: boolean;
  daysAfter?: number;
  timeHour?: number;
  hasHelp?: boolean;
}

interface AutoPointSection {
  title: string;
  items: AutoPointItem[];
}

const AutoPointSettings = () => {
  const [isAutoPointEnabled, setIsAutoPointEnabled] = useState(true);
  
  const [sections, setSections] = useState<AutoPointSection[]>([
    {
      title: '등록',
      items: [
        {
          id: 'new-registration',
          label: '회원 신규 등록 시',
          description: '안녕하세요. {시설 이름} 신규회원으로 등록하신 것을 환영합니다. 즐거운 운동시간 되세요. 감사합니다.\n\n[회원용 예약앱 다운로드 방법]\n은 아래를 참고해 주세요.\n\n등록하신 회원권 : {보유 회원권}',
          isActive: true,
        },
        {
          id: 're-registration',
          label: '회원권 연장 및 재등록 시',
          description: '안녕하세요. {시설 이름}에 재등록해주신 것을 감사드립니다. 계속해서 만족을 드릴 수 있는 {시설 이름}이 되겠습니다. 감사합니다.\n{보유 회원권}',
          isActive: false,
        },
      ],
    },
    {
      title: '출석/수업',
      items: [
        {
          id: 'attendance',
          label: '출석 시',
          description: '안녕하세요. {시설 이름}입니다. {회원 이름}님이 출석하셨습니다. 감사합니다.',
          isActive: false,
        },
        {
          id: 'last-attendance',
          label: '마지막 출석',
          description: '안녕하세요. {시설 이름}입니다. {회원 이름}님, 마지막으로 방문해 운동하신지 7일이 지났습니다. 오랜만에 운동하러 나오시는 건 어떨까요? 감사합니다.',
          isActive: true,
          hasTimeSettings: true,
          daysAfter: 7,
          timeHour: 10,
        },
        {
          id: 'lesson-reservation',
          label: '수업 예약시',
          description: '안녕하세요. {시설 이름}입니다. 수업 예약이 완료되었습니다. 수업명: {수업 이름} 예약 시간: {예약 시간} 강사명: {강사 이름} 수업 시간에 늦지 않게 참석해 주세요. 감사합니다.',
          isActive: true,
          hasHelp: true,
        },
        {
          id: 'reservation-cancel',
          label: '예약 취소시',
          description: '안녕하세요. {시설 이름}입니다. 고객님의 예약이 취소되었습니다. 감사합니다.',
          isActive: false,
          hasHelp: true,
        },
      ],
    },
  ]);

  const toggleItem = (sectionIndex: number, itemId: string) => {
    setSections(prev => prev.map((section, idx) => {
      if (idx !== sectionIndex) return section;
      return {
        ...section,
        items: section.items.map(item => 
          item.id === itemId ? { ...item, isActive: !item.isActive } : item
        ),
      };
    }));
  };

  const updateTimeSettings = (sectionIndex: number, itemId: string, field: 'daysAfter' | 'timeHour', value: number) => {
    setSections(prev => prev.map((section, idx) => {
      if (idx !== sectionIndex) return section;
      return {
        ...section,
        items: section.items.map(item => 
          item.id === itemId ? { ...item, [field]: value } : item
        ),
      };
    }));
  };

  return (
    <div className="auto-point-settings">
      {/* 상단 토글 */}
      <div className="main-toggle-section">
        <label className="main-toggle">
          <input
            type="checkbox"
            checked={isAutoPointEnabled}
            onChange={(e) => setIsAutoPointEnabled(e.target.checked)}
          />
          <span className="custom-checkbox">
            {isAutoPointEnabled && <Check size={14} />}
          </span>
          <span className="main-toggle-text">설정대로 포인트 자동 지급합니다.</span>
        </label>
      </div>

      <div className="main-description">
        <p>자동포인트 지급 기능을 켜두시면 아래 설정의 조건이 충족될 때</p>
        <p>회원님들께 자동으로 포인트를 지급해 편하고 효과적인 마케팅을 진행하실 수 있습니다.</p>
      </div>

      {/* 섹션들 */}
      {sections.map((section, sectionIndex) => (
        <div key={section.title} className="settings-section">
          <h2 className="section-title">{section.title}</h2>
          
          <div className="settings-table">
            {section.items.map((item) => (
              <div key={item.id} className="settings-row">
                <div className="settings-row-left">
                  <label className="item-toggle">
                    <input
                      type="checkbox"
                      checked={item.isActive}
                      onChange={() => toggleItem(sectionIndex, item.id)}
                    />
                    <span className="custom-checkbox">
                      {item.isActive && <Check size={14} />}
                    </span>
                    <span className="item-label">{item.label}</span>
                  </label>
                  
                  {item.hasTimeSettings && (
                    <div className="time-settings">
                      <select 
                        value={item.daysAfter} 
                        onChange={(e) => updateTimeSettings(sectionIndex, item.id, 'daysAfter', Number(e.target.value))}
                        className="time-select"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 14, 30].map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                      <span className="time-label">일 후</span>
                      <select 
                        value={item.timeHour} 
                        onChange={(e) => updateTimeSettings(sectionIndex, item.id, 'timeHour', Number(e.target.value))}
                        className="time-select"
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                      <span className="time-label">시에</span>
                    </div>
                  )}
                  
                  {item.hasHelp && (
                    <button className="help-btn">
                      <HelpCircle size={16} />
                    </button>
                  )}
                </div>
                
                <div className="settings-row-content">
                  <p className="item-description">{item.description}</p>
                </div>
                
                <div className="settings-row-action">
                  <button className="edit-button">수정하기</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AutoPointSettings;
