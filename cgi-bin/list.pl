#!/usr/bin/perl

use DBI;
use CGI;
use strict;
use warnings;

# recibimos parametros
my $q = CGI->new;
my $owner = $q->param("usuario");

my $user = 'alumno';
my $password = 'pweb1';
my $dsn = "DBI:MariaDB:database=pweb1;host=192.168.1.6";
my $dbh = DBI->connect($dsn, $user, $password) or die("No se pudo conectar!");;

print $q->header('text/XML');
print "<?xml version='1.0' encoding='utf-8'?>\n";

# listado de paginas

my $sth = $dbh->prepare("SELECT title FROM Articles WHERE owner=?");
$sth->execute($owner);

print "<articles>\n";
while(my @row = $sth->fetchrow_array){

    print "<article>\n";
		print "<owner> $owner </owner>";
		print "<title> @row </title>";
    print "</article>\n";
	
}
print "</articles>\n";
$sth->finish;
$dbh->disconnect;