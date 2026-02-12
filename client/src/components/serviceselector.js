import React from 'react';

const ServiceSelector = ({ services, onSelectService }) => {
  return (
    <div>
      <h3>Select a Service</h3>
      <ul>
        {services.map(service => (
          <li key={service.id}>
            <button onClick={() => onSelectService(service.id)}>
              {service.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceSelector;
