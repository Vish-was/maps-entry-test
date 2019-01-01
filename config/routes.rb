Rails.application.routes.draw do
  get 'home/search'
  root 'home#search'

  resources :places
  post '/create' => 'places#create'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
