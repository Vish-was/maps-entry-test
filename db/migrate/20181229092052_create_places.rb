class CreatePlaces < ActiveRecord::Migration[5.2]
  def change
    create_table :places do |t|
      t.string :name
      t.string :city
      t.string :street
      t.integer :street_no
      t.text :open_hour, array: true, default: []

      t.timestamps
    end
  end
end
