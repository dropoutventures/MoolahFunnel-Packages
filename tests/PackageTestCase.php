<?php

namespace Vendor\WirelessCharger\Tests;

use Vendor\WirelessCharger\PackageServiceProvider;
use Orchestra\Testbench\TestCase;

abstract class PackageTestCase extends TestCase
{

    protected function getPackageProviders($app)
    {
        return [PackageServiceProvider::class];
    }
}
