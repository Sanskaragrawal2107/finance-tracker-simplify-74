
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '@/components/common/PageTitle';
import CustomCard from '@/components/ui/CustomCard';
import { User, Users, Building2, PieChart, BarChart } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/lib/types';
import { supervisors } from '@/data/supervisors';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface SupervisorStats {
  totalSites: number;
  activeSites: number;
  completedSites: number;
}

const AdminDashboard: React.FC = () => {
  const [selectedSupervisorId, setSelectedSupervisorId] = useState<string | null>(null);
  const [supervisorStats, setSupervisorStats] = useState<Record<string, SupervisorStats>>({});
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Check if user is admin
  useEffect(() => {
    const userRole = localStorage.getItem('userRole') as UserRole;
    if (userRole !== UserRole.ADMIN) {
      toast.error("You don't have permission to access this page");
      navigate('/');
    }
  }, [navigate]);

  // Simulate fetching supervisor statistics
  useEffect(() => {
    // In a real app, this would be an API call
    const mockStats: Record<string, SupervisorStats> = {};
    
    supervisors.forEach(supervisor => {
      mockStats[supervisor.id] = {
        totalSites: Math.floor(Math.random() * 10) + 1,
        activeSites: Math.floor(Math.random() * 6) + 1,
        completedSites: Math.floor(Math.random() * 5) + 1
      };
    });
    
    setSupervisorStats(mockStats);
  }, []);

  const handleViewSites = (supervisorId: string) => {
    navigate('/expenses', { state: { supervisorId } });
  };

  const getSelectedSupervisor = () => {
    return supervisors.find(s => s.id === selectedSupervisorId);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageTitle 
        title="Admin Dashboard" 
        subtitle="Manage supervisors and view site statistics"
        className="mb-4"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <CustomCard className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Supervisors</h3>
              <p className="text-2xl font-bold">{supervisors.length}</p>
            </div>
          </div>
        </CustomCard>
        
        <CustomCard className="bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Sites</h3>
              <p className="text-2xl font-bold">
                {Object.values(supervisorStats).reduce((sum, stat) => sum + stat.totalSites, 0)}
              </p>
            </div>
          </div>
        </CustomCard>
        
        <CustomCard className="bg-gradient-to-br from-purple-50 to-violet-50">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <BarChart className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Active Sites</h3>
              <p className="text-2xl font-bold">
                {Object.values(supervisorStats).reduce((sum, stat) => sum + stat.activeSites, 0)}
              </p>
            </div>
          </div>
        </CustomCard>
      </div>
      
      <CustomCard>
        <h2 className="text-xl font-semibold mb-4">Supervisor Management</h2>
        <div className="mb-6">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Select a supervisor to view their sites
          </label>
          <div className="max-w-md">
            <Select 
              value={selectedSupervisorId || ''} 
              onValueChange={(value) => setSelectedSupervisorId(value || null)}
            >
              <SelectTrigger className="w-full">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Select Supervisor" />
              </SelectTrigger>
              <SelectContent>
                {supervisors.map((supervisor) => (
                  <SelectItem key={supervisor.id} value={supervisor.id}>
                    {supervisor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {selectedSupervisorId && (
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-background">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">{getSelectedSupervisor()?.name}</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-800 hover:bg-blue-50">
                      {supervisorStats[selectedSupervisorId]?.totalSites || 0} Total Sites
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-800 hover:bg-green-50">
                      {supervisorStats[selectedSupervisorId]?.activeSites || 0} Active
                    </Badge>
                    <Badge variant="outline" className="bg-amber-50 text-amber-800 hover:bg-amber-50">
                      {supervisorStats[selectedSupervisorId]?.completedSites || 0} Completed
                    </Badge>
                  </div>
                </div>
                
                <Button onClick={() => handleViewSites(selectedSupervisorId)}>
                  <Building2 className="h-4 w-4 mr-2" />
                  View Sites
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {!selectedSupervisorId && (
          <div className="text-center py-6">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">Select a Supervisor</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Choose a supervisor from the dropdown to view their sites and performance statistics.
            </p>
          </div>
        )}
      </CustomCard>
      
      <CustomCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="h-auto py-6 flex flex-col items-center justify-center text-center"
            onClick={() => navigate('/expenses')}
          >
            <Building2 className="h-8 w-8 mb-2" />
            <span className="text-base font-medium">View All Sites</span>
            <span className="text-xs text-muted-foreground mt-1">
              Access complete site listing
            </span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-6 flex flex-col items-center justify-center text-center"
            onClick={() => navigate('/dashboard')}
          >
            <PieChart className="h-8 w-8 mb-2" />
            <span className="text-base font-medium">Financial Overview</span>
            <span className="text-xs text-muted-foreground mt-1">
              View financial statistics
            </span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-6 flex flex-col items-center justify-center text-center"
            onClick={() => navigate('/expenses', { state: { newSite: true } })}
          >
            <Building2 className="h-8 w-8 mb-2" />
            <span className="text-base font-medium">Create New Site</span>
            <span className="text-xs text-muted-foreground mt-1">
              Add a new construction site
            </span>
          </Button>
        </div>
      </CustomCard>
    </div>
  );
};

export default AdminDashboard;
