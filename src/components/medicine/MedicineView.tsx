import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Pill, 
  Clock, 
  Calendar,
  Bell,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Utensils
} from 'lucide-react';
import { Medicine, MedicineReminder, MedicineStats } from '../../types/medicine';
import { medicineApi } from '../../services/medicineApi';
import { MedicineForm } from './MedicineForm';
import { MedicineCard } from './MedicineCard';
import { TodaysReminders } from './TodaysReminders';
import { MedicineStats as MedicineStatsComponent } from './MedicineStats';
import { MedicineSettings } from './MedicineSettings';

interface MedicineViewProps {
  onBack: () => void;
}

export function MedicineView({ onBack }: MedicineViewProps) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [todaysReminders, setTodaysReminders] = useState<MedicineReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'medicines' | 'reminders' | 'stats' | 'settings'>('overview');
  const [showMedicineForm, setShowMedicineForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [medicinesData, remindersData] = await Promise.all([
        medicineApi.getMedicines(),
        medicineApi.getTodaysReminders(),
      ]);
      
      setMedicines(medicinesData);
      setTodaysReminders(remindersData);
    } catch (error) {
      console.error('Failed to load medicine data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicine = async (medicineData: Omit<Medicine, 'id' | 'createdAt' | 'missedDoses' | 'totalDoses'>) => {
    try {
      await medicineApi.addMedicine(medicineData);
      await loadData();
      setShowMedicineForm(false);
    } catch (error) {
      console.error('Failed to add medicine:', error);
    }
  };

  const handleUpdateMedicine = async (medicineId: string, updates: Partial<Medicine>) => {
    try {
      await medicineApi.updateMedicine(medicineId, updates);
      await loadData();
      setEditingMedicine(null);
    } catch (error) {
      console.error('Failed to update medicine:', error);
    }
  };

  const handleDeleteMedicine = async (medicineId: string) => {
    if (confirm('Are you sure you want to delete this medicine?')) {
      try {
        await medicineApi.deleteMedicine(medicineId);
        await loadData();
      } catch (error) {
        console.error('Failed to delete medicine:', error);
      }
    }
  };

  const handleMarkTaken = async (reminderId: string) => {
    try {
      await medicineApi.markReminderTaken(reminderId);
      await loadData();
    } catch (error) {
      console.error('Failed to mark reminder as taken:', error);
    }
  };

  const handleMarkMissed = async (reminderId: string) => {
    try {
      await medicineApi.markReminderMissed(reminderId);
      await loadData();
    } catch (error) {
      console.error('Failed to mark reminder as missed:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Pill },
    { id: 'medicines', label: 'Medicines', icon: Pill },
    { id: 'reminders', label: 'Today', icon: Bell },
    { id: 'stats', label: 'Stats', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const pendingReminders = todaysReminders.filter(r => r.status === 'pending').length;
  const missedReminders = todaysReminders.filter(r => r.status === 'missed').length;
  const takenReminders = todaysReminders.filter(r => r.status === 'taken').length;

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <button onClick={onBack} className="text-purple-600 dark:text-purple-400">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Medicine Tracker</h1>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Loading medicines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Medicine Tracker</h1>
        </div>
        
        {activeTab === 'medicines' && (
          <button
            onClick={() => setShowMedicineForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={16} />
            <span>Add Medicine</span>
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.id === 'reminders' && pendingReminders > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingReminders}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
              <CheckCircle className="mx-auto mb-2 text-green-600 dark:text-green-400" size={24} />
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">{takenReminders}</div>
              <div className="text-xs text-green-600 dark:text-green-400">Taken Today</div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-center">
              <Clock className="mx-auto mb-2 text-yellow-600 dark:text-yellow-400" size={24} />
              <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{pendingReminders}</div>
              <div className="text-xs text-yellow-600 dark:text-yellow-400">Pending</div>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center">
              <XCircle className="mx-auto mb-2 text-red-600 dark:text-red-400" size={24} />
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">{missedReminders}</div>
              <div className="text-xs text-red-600 dark:text-red-400">Missed</div>
            </div>
          </div>

          {/* Active Medicines */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                <Pill className="mr-2 text-purple-600 dark:text-purple-400" size={18} />
                Active Medicines
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {medicines.length} active
              </span>
            </div>
            
            {medicines.length === 0 ? (
              <div className="text-center py-6">
                <Pill className="mx-auto mb-3 text-gray-400" size={32} />
                <p className="text-gray-500 dark:text-gray-400 text-sm">No medicines added yet</p>
                <button
                  onClick={() => {
                    setActiveTab('medicines');
                    setShowMedicineForm(true);
                  }}
                  className="mt-2 text-purple-600 dark:text-purple-400 text-sm hover:underline"
                >
                  Add your first medicine
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {medicines.slice(0, 3).map((medicine) => (
                  <div key={medicine.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{medicine.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {medicine.dosage} {medicine.unit} • {medicine.frequency.replace('_', ' ')}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {medicine.timing === 'before_meal' && (
                        <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
                          <Utensils size={12} className="mr-1" />
                          Before meal
                        </div>
                      )}
                      {medicine.timing === 'after_meal' && (
                        <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                          <Utensils size={12} className="mr-1" />
                          After meal
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {medicines.length > 3 && (
                  <button
                    onClick={() => setActiveTab('medicines')}
                    className="w-full p-2 text-center text-purple-600 dark:text-purple-400 text-sm hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                  >
                    View all {medicines.length} medicines
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Next Reminders */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Bell className="mr-2 text-blue-600 dark:text-blue-400" size={18} />
              Next Reminders
            </h3>
            
            {pendingReminders === 0 ? (
              <div className="text-center py-4">
                <CheckCircle className="mx-auto mb-2 text-green-500" size={24} />
                <p className="text-green-600 dark:text-green-400 text-sm">All caught up for today!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todaysReminders
                  .filter(r => r.status === 'pending')
                  .slice(0, 3)
                  .map((reminder) => {
                    const medicine = medicines.find(m => m.id === reminder.medicineId);
                    if (!medicine) return null;
                    
                    return (
                      <div key={reminder.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{medicine.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {reminder.scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <button
                          onClick={() => handleMarkTaken(reminder.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                        >
                          Mark Taken
                        </button>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'medicines' && (
        <div className="space-y-4">
          {medicines.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
                <Pill className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Medicines Added
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  Start by adding your medicines to get personalized reminders
                </p>
                <button
                  onClick={() => setShowMedicineForm(true)}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus size={20} />
                  <span>Add Your First Medicine</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {medicines.map((medicine) => (
                <MedicineCard
                  key={medicine.id}
                  medicine={medicine}
                  onEdit={(med) => setEditingMedicine(med)}
                  onDelete={handleDeleteMedicine}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'reminders' && (
        <TodaysReminders
          reminders={todaysReminders}
          medicines={medicines}
          onMarkTaken={handleMarkTaken}
          onMarkMissed={handleMarkMissed}
        />
      )}

      {activeTab === 'stats' && (
        <MedicineStatsComponent medicines={medicines} />
      )}

      {activeTab === 'settings' && (
        <MedicineSettings />
      )}

      {/* Medicine Form Modal */}
      <MedicineForm
        isOpen={showMedicineForm || editingMedicine !== null}
        onClose={() => {
          setShowMedicineForm(false);
          setEditingMedicine(null);
        }}
        onSave={editingMedicine ? 
          (data) => handleUpdateMedicine(editingMedicine.id, data) : 
          handleAddMedicine
        }
        editingMedicine={editingMedicine}
      />
    </div>
  );
}