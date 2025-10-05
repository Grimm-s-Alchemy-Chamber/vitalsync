import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Target, Award, BarChart3 } from 'lucide-react';
import { Medicine, MedicineStats as MedicineStatsType } from '../../types/medicine';
import { medicineApi } from '../../services/medicineApi';

interface MedicineStatsProps {
  medicines: Medicine[];
}

export function MedicineStats({ medicines }: MedicineStatsProps) {
  const [selectedMedicine, setSelectedMedicine] = useState<string>('all');
  const [stats, setStats] = useState<Record<string, MedicineStatsType>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, [medicines]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const statsData: Record<string, MedicineStatsType> = {};
      
      for (const medicine of medicines) {
        const medicineStats = await medicineApi.getMedicineStats(medicine.id);
        statsData[medicine.id] = medicineStats;
      }
      
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOverallStats = () => {
    const totalDoses = Object.values(stats).reduce((sum, stat) => sum + stat.totalDoses, 0);
    const takenDoses = Object.values(stats).reduce((sum, stat) => sum + stat.takenDoses, 0);
    const missedDoses = Object.values(stats).reduce((sum, stat) => sum + stat.missedDoses, 0);
    const adherenceRate = totalDoses > 0 ? (takenDoses / totalDoses) * 100 : 100;

    return {
      adherenceRate: Math.round(adherenceRate),
      totalDoses,
      takenDoses,
      missedDoses,
      streakDays: Math.max(...Object.values(stats).map(s => s.streakDays), 0),
      lastWeekAdherence: [85, 92, 78, 95, 88, 90, 85], // Mock aggregated data
    };
  };

  const currentStats = selectedMedicine === 'all' ? getOverallStats() : stats[selectedMedicine];

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Loading statistics...</p>
      </div>
    );
  }

  if (medicines.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
          <BarChart3 className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Statistics Available
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Add medicines and start taking them to see your adherence statistics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Medicine Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          View Statistics For
        </label>
        <select
          value={selectedMedicine}
          onChange={(e) => setSelectedMedicine(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Medicines</option>
          {medicines.map(medicine => (
            <option key={medicine.id} value={medicine.id}>
              {medicine.name}
            </option>
          ))}
        </select>
      </div>

      {currentStats && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-3 mb-3">
                <Target className="text-green-600 dark:text-green-400" size={24} />
                <h3 className="font-semibold text-green-900 dark:text-green-100">Adherence Rate</h3>
              </div>
              <div className="text-3xl font-bold text-green-700 dark:text-green-300 mb-1">
                {currentStats.adherenceRate}%
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">
                {currentStats.takenDoses} of {currentStats.totalDoses} doses taken
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3 mb-3">
                <Award className="text-blue-600 dark:text-blue-400" size={24} />
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Current Streak</h3>
              </div>
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                {currentStats.streakDays}
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                consecutive days
              </p>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="mr-2 text-purple-600 dark:text-purple-400" size={20} />
              Detailed Statistics
            </h3>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentStats.totalDoses}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Doses</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {currentStats.takenDoses}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">Taken</div>
              </div>
              
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {currentStats.missedDoses}
                </div>
                <div className="text-sm text-red-600 dark:text-red-400">Missed</div>
              </div>
            </div>

            {/* Weekly Adherence Chart */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Calendar className="mr-2 text-gray-600 dark:text-gray-400" size={16} />
                Last 7 Days Adherence
              </h4>
              
              <div className="flex items-end space-x-2 h-32">
                {currentStats.lastWeekAdherence.map((rate, index) => {
                  const height = (rate / 100) * 100; // Convert to percentage of container height
                  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t-lg relative overflow-hidden" style={{ height: '100px' }}>
                        <div
                          className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-500 ${
                            rate >= 90 ? 'bg-green-500' :
                            rate >= 70 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        {dayNames[index]}
                      </div>
                      <div className="text-xs font-medium text-gray-900 dark:text-white">
                        {rate}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center">
              <TrendingUp className="mr-2 text-purple-600 dark:text-purple-400" size={20} />
              Insights & Recommendations
            </h3>
            
            <div className="space-y-3">
              {currentStats.adherenceRate >= 95 && (
                <div className="flex items-start space-x-3 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Award className="text-green-600 dark:text-green-400 mt-0.5" size={16} />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">Excellent Adherence!</p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      You're doing great! Keep up the consistent routine.
                    </p>
                  </div>
                </div>
              )}
              
              {currentStats.adherenceRate < 70 && (
                <div className="flex items-start space-x-3 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Target className="text-yellow-600 dark:text-yellow-400 mt-0.5" size={16} />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">Room for Improvement</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Try setting more frequent reminders or linking medicine times to daily habits.
                    </p>
                  </div>
                </div>
              )}
              
              {currentStats.missedDoses > 0 && (
                <div className="flex items-start space-x-3 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Calendar className="text-blue-600 dark:text-blue-400 mt-0.5" size={16} />
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-200">Consistency Tip</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Consider taking medicines at the same time as your meals for better routine.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}