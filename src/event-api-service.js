import ApiService from "./framework/api-service";

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class EventApiService extends ApiService {
  constructor() {
    super('https://23.objects.htmlacademy.pro/big-trip', 'Basic eo0w590ik29889a'); // замените на свой токен
  }

  async getEvents() {
    const response = await this._load({ url: 'points' });
    return this._adaptPointsData(await ApiService.parseResponse(response));
  }

  async getDestinations() {
    const response = await this._load({ url: 'destinations' });
    return this._adaptDestinationsData(await ApiService.parseResponse(response));
  }

  async getOffers() {
    const response = await this._load({ url: 'offers' });
    return this._adaptOffersData(await ApiService.parseResponse(response));
  }

  async updateEvent(event) {
    const adaptedEvent = this._adaptEventForServer(event);
    const response = await this._load({
      url: `points/${event.id}`,
      method: Method.PUT,
      body: JSON.stringify(adaptedEvent),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const updatedData = await ApiService.parseResponse(response);
    return this._adaptPointsData([updatedData])[0];
  }

  _adaptEventForServer(event) {
    console.log(event);
    return {
      id: event.id,
      type: event.type,
      base_price: event.basePrice,
      date_from: event.dateFrom.toISOString(),
      date_to: event.dateTo.toISOString(),
      destination: event.destination,
      offers: event.offers.map((offer) => ({
        id: offer.id,
        title: offer.title,
        price: offer.price
      })),
      is_favorite: event.isFavorite,
    };
  }

  _adaptPointsData(points) {
    return points.map((point) => ({
      id: point.id,
      type: point.type,
      dateFrom: new Date(point.date_from),
      dateTo: new Date(point.date_to),
      basePrice: point.base_price,
      destination: point.destination,
      offers: point.offers,
      isFavorite: point.is_favorite,
    }));
  }

  _adaptDestinationsData(destinations) {
    return destinations.map((destination) => ({
      id: destination.id,
      name: destination.name,
      description: destination.description,
      pictures: destination.pictures,
    }));
  }

  _adaptOffersData(offers) {
    return offers.map((offer) => ({
      type: offer.type,
      offers: offer.offers.map((offerItem) => ({
        id: offerItem.id,
        title: offerItem.title,
        price: offerItem.price,
        isChecked: offerItem.isChecked || false,
      })),
    }));
  }
}
