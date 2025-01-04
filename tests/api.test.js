const request = require('supertest');
const http = require('http');
const {
  getPackages,
  getPackageByDestination,
  addBookings,
  updateSlots,
  getBookingByPackage,
} = require('../controllers');
const { app } = require('../index.js');

jest.mock('../controllers', () => ({
  ...jest.requireActual('../controllers'),
  getPackages: jest.fn(),
  getPackageByDestination: jest.fn(),
  addBookings: jest.fn(),
  updateSlots: jest.fn(),
  getBookingByPackage: jest.fn(),
}));

let server;

beforeAll(async () => {
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(3000, resolve);
  });
});

afterAll(async () => {
  server.close();
});

jest.setTimeout(10000);

describe('API Endpoints tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /packages endpoint retrieves all travel packages successfully', async () => {
    getPackages.mockResolvedValue([
      {
        packageId: 1,
        destination: 'Paris',
        price: 1500,
        duration: 7,
        availableSlots: 10,
      },
      // Add other packages if necessary
    ]);

    const res = await request(server).get('/packages');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      packages: [
        {
          packageId: 1,
          destination: 'Paris',
          price: 1500,
          duration: 7,
          availableSlots: 10,
        },
      ],
    });
  });

  it('GET /packages/:destination endpoint retrieves the correct package details', async () => {
    getPackageByDestination.mockResolvedValue({
      packageId: 1,
      destination: 'Paris',
      price: 1500,
      duration: 7,
      availableSlots: 10,
    });

    const res = await request(server).get('/packages/Paris');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      package: {
        packageId: 1,
        destination: 'Paris',
        price: 1500,
        duration: 7,
        availableSlots: 10,
      },
    });
  });

  it('POST /bookings endpoint adds a booking correctly.', async () => {
    const newBooking = {
      packageId: 1,
      customerName: 'Raj Kulkarni',
      bookingDate: '2024-12-20',
      seats: 2,
    };

    const mockNewBooking = { bookingId: 6, ...newBooking };
    addBookings.mockResolvedValue(mockNewBooking);

    const res = await request(server).post('/bookings').send(newBooking);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ booking: mockNewBooking });
    expect(addBookings).toHaveBeenCalledWith(newBooking);
  });

  it('POST /packages/update-seats updates available slots correctly', async () => {
    const updateData = {
      packageId: 1,
      seatsBooked: 2,
    };

    const mockUpdatedPackage = {
      packageId: 1,
      destination: 'Paris',
      price: 1500,
      duration: 7,
      availableSlots: 8,
    };
    updateSlots.mockResolvedValue(mockUpdatedPackage);

    const res = await request(server).post('/packages/update-seats').send(updateData);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ package: mockUpdatedPackage });
    expect(updateSlots).toHaveBeenCalledWith(
      updateData.packageId,
      updateData.seatsBooked
    );
  });

  it('GET /bookings/:packageId endpoint retrieves all bookings for a package.', async () => {
    getBookingByPackage.mockResolvedValue([
      {
        bookingId: 1,
        packageId: 1,
        customerName: 'Anjali Seth',
        bookingDate: '2024-12-01',
        seats: 2,
      },
    ]);

    const res = await request(server).get('/bookings/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      bookings: [
        {
          bookingId: 1,
          packageId: 1,
          customerName: 'Anjali Seth',
          bookingDate: '2024-12-01',
          seats: 2,
        },
      ],
    });
    expect(getBookingByPackage).toHaveBeenCalledWith(1);
  });
});
