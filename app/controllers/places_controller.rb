class PlacesController < ApplicationController

  def index
    @places = Place.all
  end

  def create
    place = Place.find_by_name(place_params["name"])
    place = place.present? ? place : Place.new(place_params) 
    if place.save
      redirect_to places_path
    else
      redirect_to root_path
    end
  end

  private
  def place_params
    params.require(:place).permit!
  end
end
