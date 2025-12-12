import React from 'react';
import { Users, User, Crown } from 'lucide-react';

type GroupMembersListProps = {
  members: string[];
  currentUserId: string;
  maxMembers: number;
  isOpen: boolean;
  onToggle: () => void;
  darkMode: boolean;
};

const GroupMembersList: React.FC<GroupMembersListProps> = ({
  members,
  currentUserId,
  maxMembers,
  isOpen,
  onToggle,
  darkMode,
}) => {
  const allMembers = [currentUserId, ...members.filter(m => m !== currentUserId)];
  
  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all text-sm ${
          darkMode
            ? 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400'
            : 'bg-cyan-100 hover:bg-cyan-200 text-cyan-700'
        }`}
      >
        <Users size={18} />
        <span className="text-sm font-medium">{allMembers.length}/{maxMembers}</span>
      </button>

      {/* Members Panel */}
      {isOpen && (
        <div
          className={`fixed inset-x-0 bottom-0 h-56 sm:relative sm:inset-auto sm:top-12 sm:right-0 sm:w-72 sm:h-auto max-h-96 overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl z-50 ${
            darkMode
              ? 'bg-slate-900/95 border-t border-cyan-500/30 sm:border sm:border-cyan-500/30'
              : 'bg-white/95 border-t border-cyan-200 sm:border sm:border-cyan-200'
          } backdrop-blur-xl`}
          role="dialog"
        >
          <div className={`sticky top-0 px-4 py-3 border-b ${
            darkMode ? 'border-cyan-500/20 bg-slate-900/95' : 'border-cyan-100 bg-white/95'
          }`}>
            <h3 className={`font-semibold flex items-center gap-2 ${
              darkMode ? 'text-cyan-400' : 'text-cyan-700'
            }`}>
              <Users size={16} />
              Group Members ({allMembers.length})
            </h3>
          </div>
          
          <div className="p-2 sm:p-2">
            <div className="sm:block flex gap-2 overflow-x-auto px-1 py-1">
              {allMembers.map((memberId, index) => {
              const isCurrentUser = memberId === currentUserId;
              const isFirst = index === 0;
              
              return (
                <div
                  key={memberId}
                  className={`flex sm:flex-row flex-col items-center sm:items-center gap-3 sm:gap-3 px-3 py-2 min-w-[88px] sm:min-w-0 rounded-xl transition-colors ${
                    darkMode
                      ? 'hover:bg-cyan-500/10'
                      : 'hover:bg-cyan-50'
                  }`}
                  style={{
                    flex: '0 0 auto'
                  }}
                >
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      isCurrentUser
                        ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white'
                        : darkMode
                          ? 'bg-slate-700 text-slate-300'
                          : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isCurrentUser ? (
                      <User size={18} />
                    ) : (
                      memberId.substring(0, 2).toUpperCase()
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <p className={`text-sm font-medium truncate ${
                      darkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      {isCurrentUser ? 'You' : `User ${memberId.substring(0, 8)}...`}
                    </p>
                    <p className={`text-xs truncate ${
                      darkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {memberId.substring(0, 16)}...
                    </p>
                  </div>

                  {/* Badge */}
                  {isFirst && (
                    <div className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                      darkMode
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      <Crown size={12} />
                      Creator
                    </div>
                  )}
                  {isCurrentUser && !isFirst && (
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      darkMode
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-cyan-100 text-cyan-700'
                    }`}>
                      You
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          </div>

          {/* Footer */}
          <div className={`px-4 py-3 border-t text-xs text-center ${
            darkMode ? 'border-cyan-500/20 text-slate-500' : 'border-cyan-100 text-slate-400'
          }`}>
            {maxMembers - allMembers.length} slots remaining
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupMembersList;
