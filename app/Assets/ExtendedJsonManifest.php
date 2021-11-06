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
        $file = isset($this->manifest[$asset]) && isset($this->manifest[$asset]['file']) ?
            "{$this->dist}/{$this->manifest[$asset]['file']}" : "{$this->dist}/{$asset}";

        if ($file && $extractCss) {
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
