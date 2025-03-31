            {/* Imágenes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Imágenes (máximo 5)</label>
              <div className="grid gap-4 md:grid-cols-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Imagen ${index + 1}`}
                      className="h-32 w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {formData.images.length < 5 && (
                  <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <label className="flex cursor-pointer flex-col items-center">
                      <ImagePlus className="h-8 w-8 text-gray-400" />
                      <span className="mt-1 text-sm text-gray-500">Agregar imagen</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* URL de Google Maps */}
            <div className="space-y-2">
              <label className="text-sm font-medium">URL de Google Maps</label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  value={formData.google_maps_url || ''}
                  onChange={(e) => setFormData({ ...formData, google_maps_url: e.target.value })}
                  placeholder="https://maps.google.com/..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.open('https://www.google.com/maps', '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Ingresa la URL de la ubicación en Google Maps
              </p>
            </div> 