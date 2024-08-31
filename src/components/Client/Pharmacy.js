import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const Pharmacy = ({ drugs }) => {

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      {drugs.map((drug, index) => (
          <Card key={index} style={{ width: '300px', margin: '10px' }}>
              <CardContent>
                  <Typography variant="h6" component="div">
                      {drug.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                      Brand: {drug.brand}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                      Generic: {drug.generic}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                      Dosage Form: {drug.dosageForm}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                      Strength: {drug.strength}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                      Route: {drug.route}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                      Description: {drug.description}
                  </Typography>
              </CardContent>
          </Card>
      ))}
  </div>
    );
};

export default Pharmacy;
