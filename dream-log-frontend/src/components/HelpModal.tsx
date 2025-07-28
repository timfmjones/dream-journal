// src/components/HelpModal.tsx

import React, { useState } from 'react';
import { X, HelpCircle, Mic, Wand2, Brain, Image, Star, Book, Settings, User } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'getting-started' | 'features' | 'tips'>('getting-started');

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #6b46c1 0%, #7c3aed 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <HelpCircle style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#1F2937',
              margin: 0
            }}>
              Dream Log Help
            </h2>
          </div>
          
          <button
            onClick={onClose}
            style={{
              color: '#9CA3AF',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#6B7280'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
          >
            <X style={{ width: '24px', height: '24px' }} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          padding: '16px 24px',
          borderBottom: '1px solid #E5E7EB'
        }}>
          {[
            { id: 'getting-started' as const, label: 'Getting Started' },
            { id: 'features' as const, label: 'Features' },
            { id: 'tips' as const, label: 'Tips & Tricks' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab.id ? '#7c3aed' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#6B7280',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = '#F3F4F6';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          flex: 1
        }}>
          {activeTab === 'getting-started' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#1F2937', 
                  marginBottom: '12px',
                  margin: '0 0 12px 0'
                }}>
                  Welcome to Dream Log! 🌙
                </h3>
                <p style={{ color: '#6B7280', lineHeight: '1.6', margin: 0 }}>
                  Dream Log helps you record, transform, and analyze your dreams. Here's how to get started:
                </p>
              </div>

              <div style={{ 
                background: '#F9FAFB', 
                padding: '20px', 
                borderRadius: '12px',
                border: '1px solid #E5E7EB'
              }}>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#1F2937', 
                  marginBottom: '16px',
                  margin: '0 0 16px 0'
                }}>
                  Quick Start Steps
                </h4>
                <ol style={{ 
                  margin: 0, 
                  paddingLeft: '20px',
                  color: '#374151',
                  lineHeight: '1.8'
                }}>
                  <li>Record your dream using text or voice memo</li>
                  <li>Choose what you'd like to create:
                    <ul style={{ marginTop: '8px', marginBottom: '8px' }}>
                      <li>🪄 <strong>Fairy Tale</strong> - Transform your dream into a magical story</li>
                      <li>🧠 <strong>Analysis</strong> - Get insights into your dream's meaning</li>
                      <li>💾 <strong>Just Save</strong> - Save your dream as-is</li>
                    </ul>
                  </li>
                  <li>Customize your story settings (tone, length, illustrations)</li>
                  <li>Generate and save to your journal</li>
                  <li>Access your dreams anytime in the Journal section</li>
                </ol>
              </div>

              <div>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#1F2937', 
                  marginBottom: '12px',
                  margin: '0 0 12px 0'
                }}>
                  Account Options
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <User style={{ width: '20px', height: '20px', color: '#7c3aed', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#1F2937' }}>Sign In with Google</strong>
                      <p style={{ margin: '4px 0 0 0', color: '#6B7280', fontSize: '14px' }}>
                        Sync your dreams across all devices and never lose your stories
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <User style={{ width: '20px', height: '20px', color: '#6B7280', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#1F2937' }}>Guest Mode</strong>
                      <p style={{ margin: '4px 0 0 0', color: '#6B7280', fontSize: '14px' }}>
                        Try the app without signing in - dreams are saved locally on this device only
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#EDE9FE',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Mic style={{ width: '20px', height: '20px', color: '#7c3aed' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: '0 0 4px 0' }}>
                    Voice Recording
                  </h4>
                  <p style={{ margin: 0, color: '#6B7280', fontSize: '14px', lineHeight: '1.5' }}>
                    Record your dreams using voice memos. The app will automatically transcribe your recording
                    using advanced AI technology. Perfect for capturing dreams right after waking up!
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#F3E8FF',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Wand2 style={{ width: '20px', height: '20px', color: '#7c3aed' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: '0 0 4px 0' }}>
                    Fairy Tale Generation
                  </h4>
                  <p style={{ margin: 0, color: '#6B7280', fontSize: '14px', lineHeight: '1.5' }}>
                    Transform your dreams into enchanting fairy tales. Choose from different tones
                    (whimsical, mystical, adventurous, etc.) and lengths. Optionally generate
                    beautiful AI illustrations for your story.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#E0E7FF',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Brain style={{ width: '20px', height: '20px', color: '#4f46e5' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: '0 0 4px 0' }}>
                    Dream Analysis
                  </h4>
                  <p style={{ margin: 0, color: '#6B7280', fontSize: '14px', lineHeight: '1.5' }}>
                    Get thoughtful insights into your dreams. Our AI analyzes symbols, themes,
                    and emotional patterns to help you understand potential meanings and connections
                    to your waking life.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#FEF3C7',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Star style={{ width: '20px', height: '20px', color: '#F59E0B' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: '0 0 4px 0' }}>
                    Favorites
                  </h4>
                  <p style={{ margin: 0, color: '#6B7280', fontSize: '14px', lineHeight: '1.5' }}>
                    Mark special dreams as favorites for quick access. Filter your journal to show
                    only your favorite dreams. Perfect for keeping track of meaningful or recurring dreams.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#DBEAFE',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Book style={{ width: '20px', height: '20px', color: '#3B82F6' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: '0 0 4px 0' }}>
                    Dream Journal
                  </h4>
                  <p style={{ margin: 0, color: '#6B7280', fontSize: '14px', lineHeight: '1.5' }}>
                    All your dreams in one place. Search through your dreams, sort by date,
                    filter by favorites, and revisit your stories and analyses anytime.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#F3F4F6',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Settings style={{ width: '20px', height: '20px', color: '#6B7280' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: '0 0 4px 0' }}>
                    Customization
                  </h4>
                  <p style={{ margin: 0, color: '#6B7280', fontSize: '14px', lineHeight: '1.5' }}>
                    Set your default story preferences, manage your account, view statistics,
                    and export your dream data. Make Dream Log work the way you want it to.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#166534', 
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>
                  💡 Pro Tip: Dream Recall
                </h4>
                <p style={{ margin: 0, color: '#166534', fontSize: '14px', lineHeight: '1.5' }}>
                  Keep your phone nearby when you sleep. As soon as you wake up, use the voice
                  recording feature to capture your dream before it fades. Dreams are often
                  forgotten within minutes of waking!
                </p>
              </div>

              <div style={{
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#1E40AF', 
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>
                  🎨 Story Customization
                </h4>
                <p style={{ margin: 0, color: '#1E40AF', fontSize: '14px', lineHeight: '1.5' }}>
                  Experiment with different story tones to see how they transform your dream:
                </p>
                <ul style={{ margin: '8px 0 0 20px', padding: 0, color: '#1E40AF', fontSize: '14px' }}>
                  <li><strong>Whimsical</strong> - Disney-like magical adventures</li>
                  <li><strong>Mystical</strong> - Ethereal and spiritual journeys</li>
                  <li><strong>Adventurous</strong> - Epic quests and heroic tales</li>
                  <li><strong>Comedy</strong> - Funny twists on your dreams</li>
                </ul>
              </div>

              <div style={{
                background: '#FEF3C7',
                border: '1px solid #FDE68A',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#92400E', 
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>
                  ⭐ Using Favorites
                </h4>
                <p style={{ margin: 0, color: '#92400E', fontSize: '14px', lineHeight: '1.5' }}>
                  Star your most meaningful dreams to build a collection of important experiences.
                  This is great for tracking recurring dreams, lucid dreams, or dreams that feel
                  particularly significant to you.
                </p>
              </div>

              <div style={{
                background: '#F3E8FF',
                border: '1px solid #E9D5FF',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#6B21A8', 
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>
                  🔍 Dream Patterns
                </h4>
                <p style={{ margin: 0, color: '#6B21A8', fontSize: '14px', lineHeight: '1.5' }}>
                  Use the search feature to find patterns in your dreams. Search for specific
                  symbols, people, or themes to discover recurring elements. The analysis feature
                  can help identify these patterns too!
                </p>
              </div>

              <div style={{
                background: '#FEE2E2',
                border: '1px solid #FECACA',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#991B1B', 
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>
                  💾 Data Safety
                </h4>
                <p style={{ margin: 0, color: '#991B1B', fontSize: '14px', lineHeight: '1.5' }}>
                  If you're using Guest Mode, remember that your dreams are only saved on this
                  device. Sign in with Google to ensure your dreams are backed up and accessible
                  from any device. You can always export your data from Settings.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #E5E7EB',
          background: '#F9FAFB',
          borderRadius: '0 0 16px 16px',
          textAlign: 'center'
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: '14px', 
            color: '#6B7280' 
          }}>
            Need more help? Contact support at{' '}
            <a 
              href="mailto:support@dreamlog.app" 
              style={{ color: '#7c3aed', textDecoration: 'none' }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              support@dreamlog.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;