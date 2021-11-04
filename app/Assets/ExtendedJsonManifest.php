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
     * Chech if hot reload enabled
     *
     * @return boolean
     */
    public function hot()
    {
        return true;
    }

    public function hotReloadEntrypoint()
    {
        return HMR_ENTRYPOINT;
    }
}
