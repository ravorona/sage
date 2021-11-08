<?php

namespace App\Assets;

use Roots\Sage\Assets\JsonManifest;

/**
 * Class ExtendedJsonManifest
 * @package App
 * @author ravorona<h.rakotonjanahary@gmail.com>
 */
class ExtendedJsonManifest extends JsonManifest
{
    /**
     * Check if a value exist in manifest
     * @param  String $state
     * @return boolean
     */
    public function is($state)
    {
        return isset($this->manifest[$state]) && $this->manifest[$state];
    }

    /**
     * Get assets url
     *
     * @param [type] $asset
     * @param [type] $extractCss
     * @return void
     */
    public function getAssetsUri($asset, $extractCss)
    {
        $file = array_key_exists($asset, $this->manifest) && array_key_exists('file', $this->manifest[$asset]) ?
            "{$this->dist}/{$this->manifest[$asset]['file']}" : "{$this->dist}/{$asset}";

        if ($file && $extractCss && array_key_exists($asset, $this->manifest)) {
            $file = "{$this->dist}/{$this->manifest[$asset]['css'][0]}";
        }

        return $file;
    }

    /**
     * Chech if hot reload enabled
     *
     * @return boolean
     */
    public function hot()
    {
        return env('HMR_ENABLED') ?: false;
    }

    /**
     * Hot reload entrypoint
     *
     * @return string|boolean
     */
    public function hotReloadEntrypoint($asset)
    {
        $entrypoint = env('HMR_ENTRYPOINT');

        return $entrypoint ? "{$entrypoint}/{$asset}" : "{$this->dist}/{$asset}";
    }
}
