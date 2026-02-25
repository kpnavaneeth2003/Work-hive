import React, { useEffect, useState } from 'react';

const mockProviders = {
  electrician: [
    { id: 1, name: 'Alice Electrician', skills: ['Wiring', 'Lighting'] },
    { id: 2, name: 'Bob Electrician', skills: ['Circuit repair', 'Appliance installation'] },
  ],
  plumber: [
    { id: 3, name: 'Charlie Plumber', skills: ['Fix leaks', 'Install pipes'] },
  ],
  
};

const ServiceProvidersList = ({ service }) => {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    if (service) {
      
      setProviders(mockProviders[service] || []);
    } else {
      setProviders([]);
    }
  }, [service]);

  if (!service) {
    return <p>Please select a service to see providers.</p>;
  }

  return (
    <div>
      <h3>Providers for {service.replace('_', ' ')}</h3>
      {providers.length === 0 ? (
        <p>No providers available for this service.</p>
      ) : (
        <ul>
          {providers.map(provider => (
            <li key={provider.id}>
              <strong>{provider.name}</strong> - Skills: {provider.skills.join(', ')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ServiceProvidersList;
