const {getPackages,getPackageByDestination,addBookings,updateSlots,
    getBookingByPackage} = require('./controllers/index.js');
    const express = require('express');
    const app = express();
    // const PORT = 3000;
    
    app.use(express.json());
    
    app.get('/packages', (req, res) => {
      res.status(200).json({ packages: getPackages() });
    });
    
    app.get('/packages/:destination', (req, res) => {
      const packages = getPackageByDestination(req.params.destination);
      if (!packages) return res.status(404).send('Package not found.');
      res.status(200).json({ package: packages });
    });
    
    app.post('/bookings', (req, res) => {
      const newBooking = addBookings(req.body);
      res.status(201).json({ booking: newBooking });
    });
    
    app.post('/packages/update-seats', (req, res) => {
      const { packageId, seatsBooked } = req.body;
      const updatedPackage = updateSlots(packageId, seatsBooked);
      if (!updatedPackage)
        return res
          .status(400)
          .send('Not enough slots available or package not found.');
      res.status(200).json({ package: updatedPackage });
    });
    
    app.get('/bookings/:packageId', (req, res) => {
      const bookings = getBookingByPackage(parseInt(req.params.packageId));
      if (!bookings.length)
        return res.status(404).send('No bookings found for this package.');
      res.status(200).json({ bookings });
    });
    
    // app.listen(PORT, () => {
    //   console.log(`Server is running on port ${PORT}.`);
    // });
    