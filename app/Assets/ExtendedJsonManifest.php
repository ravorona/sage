<?php
/*
 * MIT License
 *
 * Copyright (c) 2021 яαvoroηα
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH
 * THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

namespace App\Assets;

use Roots\Sage\Assets\JsonManifest;

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
