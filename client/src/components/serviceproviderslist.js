import React, { useEffect, useState } from 'react';

const mockProviders = {
  ai_artist: [
    { id: 1, name: 'Alice AI Artist', skills: ['AI Art', 'Digital Painting'] },
    { id: 2, name: 'Bob AI Artist', skills: ['3D AI Modeling', 'Concept Art'] },
  ],
  plumber: [
    { id: 3, name: 'Charlie Plumber', skills: ['Fix leaks', 'Install pipes'] },
  ],
  // add more categories and providers as needed
};

const ServiceProvidersList = ({ service }) => {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    if (service) {
      // Simulate fetching data from the backend for the selected service
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
