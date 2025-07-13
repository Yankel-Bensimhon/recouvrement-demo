import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const STATUS_COLORS = {
  nouveau: '#3B82F6', // blue-500
  mise_en_demeure: '#F59E0B', // amber-500
  injonction: '#8B5CF6', // violet-500
  "assignation en référé": '#EF4444', // red-500
  solde: '#10B981', // emerald-500
  perdu: '#6B7280', // gray-500
};

const STATUTS_LABELS = {
    nouveau: "Nouveau",
    mise_en_demeure: "Mise en demeure",
    injonction: "Injonction",
    "assignation en référé": "Assignation",
    solde: "Soldé",
    perdu: "Irrécouvrable",
};

const ClaimsStatusPieChart = ({ claims }) => {
  const data = Object.entries(
    claims.reduce((acc, claim) => {
      const status = claim.status || 'inconnu';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name: STATUTS_LABELS[name] || name, value }));

  if (!claims || claims.length === 0) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-lg h-full flex flex-col justify-center items-center">
             <h3 className="text-lg font-semibold text-gray-700 mb-4">Répartition des dossiers</h3>
            <p className="text-gray-500">Aucune donnée à afficher.</p>
        </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg h-full flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Répartition par Statut</h3>
        <div className="w-full flex-grow">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                    {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[Object.keys(STATUTS_LABELS).find(key => STATUTS_LABELS[key] === entry.name)] || '#000000'} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} dossier(s)`]} />
                <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default ClaimsStatusPieChart;
